#!/usr/bin/env node
/** Provisions a Stripe account for Toppkart: product, prices, customer portal
 *  and webhook endpoint.
 *
 *  Everything `docs/deploy.md` section 3 asks you to click together in the
 *  dashboard, done from code instead — so a fresh Stripe account can be brought
 *  up in one command, the same way twice, and so the settings the app depends on
 *  are written down rather than remembered.
 *
 *  It is idempotent, and it adopts rather than duplicates. Objects it created
 *  before are recognised by `metadata.app = "toppkart"`, by lookup key or by
 *  URL. An account built by hand has none of those, so it falls back to what
 *  such an account *can* be recognised by — the product's name, a price's
 *  amount and interval, the portal being the account's default — and labels
 *  what it finds instead of building a second set beside it. That fallback is
 *  the difference between «already set up» and two products with live
 *  subscriptions split across them. It never deletes or archives anything.
 *
 *      node scripts/stripe-setup.mjs                     # dry run, changes nothing
 *      node scripts/stripe-setup.mjs --apply             # creates what is missing
 *      node scripts/stripe-setup.mjs --apply \
 *        --account acct_123 --site https://toppkart.no
 *
 *  The key is read from STRIPE_SECRET_KEY, or from `.env.local` if it is not in
 *  the environment. `--account` is a guard worth using: it aborts unless the key
 *  belongs to that account id, which is what stands between «set up Toppkart»
 *  and «wrote two prices into the wrong business».
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import Stripe from "stripe";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* Kept in step with PRICE in lib/config.ts by hand — both numbers are printed
   before anything is created, so a drift is visible rather than silent. Stripe
   takes minor units: 29 kr is 2900 øre. */
const PLANS = [
  {
    key: "maned",
    lookupKey: "toppkart_maned",
    nickname: "Toppkart månedlig",
    unitAmount: 2900,
    interval: "month",
    envVar: "STRIPE_PRICE_MONTHLY",
    human: "29 kr/mnd",
  },
  {
    key: "ar",
    lookupKey: "toppkart_ar",
    nickname: "Toppkart årlig",
    unitAmount: 29000,
    interval: "year",
    envVar: "STRIPE_PRICE_YEARLY",
    human: "290 kr/år",
  },
];

const CURRENCY = "nok";
const PRODUCT_NAME = "Toppkart";
const APP_TAG = "toppkart";

/** The six events app/api/stripe/webhook/route.ts actually acts on. Anything
 *  else is delivery the handler drops on the floor. */
const WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
];

// ---------------------------------------------------------------------------
// Arguments and environment
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { apply: false, account: null, site: null };
  /* A flag whose value is missing has to be an error, not a shrug. `--account`
     is the guard against writing into the wrong business, and silently
     swallowing `--account` with nothing after it would disarm exactly the run
     where it mattered. */
  const takeValue = (flag, value) => {
    if (!value || value.startsWith("--")) {
      console.error(`${flag} mangler en verdi.`);
      process.exit(2);
    }
    return value;
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--apply") args.apply = true;
    else if (arg === "--account") args.account = takeValue(arg, argv[++i]);
    else if (arg === "--site") args.site = takeValue(arg, argv[++i]);
    else if (arg === "--help" || arg === "-h") args.help = true;
    else {
      console.error(`Ukjent argument: ${arg}`);
      process.exit(2);
    }
  }
  return args;
}

/** Minimal `.env.local` reader. Next.js loads that file for the app; a plain
 *  node script does not, and asking people to export the key by hand is how a
 *  setup script ends up run against whatever was last in the shell. */
function readEnvFile(name) {
  let text;
  try {
    text = readFileSync(resolve(ROOT, name), "utf8");
  } catch {
    return {};
  }
  const values = {};
  for (const line of text.split("\n")) {
    const match = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

const results = [];

function record(what, state, detail) {
  results.push({ what, state, detail });
  const mark = { created: "opprettet", exists: "finnes", updated: "oppdatert", planned: "mangler" }[state];
  console.log(`  ${what.padEnd(28)} ${mark}${detail ? `  ${detail}` : ""}`);
}

/** Something that exists but is not what the app needs, and that this script
 *  will not touch — a wrong amount, a price on someone else's product. Tracked
 *  apart from `planned` because there is nothing to *create* for these, so
 *  counting only what is missing would call such an account finished. */
function warn(message) {
  results.push({ state: "warned" });
  console.log(`      ⚠ ${message}`);
}

/** Something `--apply` handles by itself: an object that is correct but
 *  unlabelled, a portal setting this script knows how to correct. Separate
 *  from `warn` so a dry run can say «--apply ordner dette» instead of filing it
 *  under problems the reader has to go solve by hand. */
function note(message) {
  results.push({ state: "noted" });
  console.log(`      ${message}`);
}

/** Stripe hands back references either expanded or as a bare id. */
function idOf(value) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/** Walks every page. The list endpoints cap at 100 per call, and finding the
 *  objects we created before is the whole of this script's idempotency — a
 *  lookup that silently stops at page one creates duplicates in any account
 *  that has grown past it. */
async function findAll(page, predicate) {
  const matches = [];
  for await (const item of page) {
    if (predicate(item)) matches.push(item);
  }
  return matches;
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

/** Marker first, then the product's own name.
 *
 *  The name fallback is what keeps this script from duplicating an account that
 *  was set up by hand: a dashboard-created «Toppkart» carries no metadata, and
 *  a marker-only lookup would declare it missing and build a second one beside
 *  it — with the live subscriptions still pointing at the first.
 */
async function ensureProduct(stripe, apply) {
  const active = await findAll(stripe.products.list({ limit: 100, active: true }), () => true);
  const tagged = active.filter((product) => product.metadata?.app === APP_TAG);
  const found = tagged[0] ?? active.find((product) => product.name === PRODUCT_NAME);

  if (found) {
    const adopt = !tagged.length;
    record("Produkt", "exists", `${found.id}${adopt ? "  (umerket)" : ""}`);
    if (tagged.length > 1) {
      warn(`${tagged.length} produkter er merket app=${APP_TAG}. Bruker ${found.id}; rydd opp i resten.`);
    }
    if (adopt) {
      if (!apply) {
        note(`«${PRODUCT_NAME}» finnes uten metadata.app=${APP_TAG}. --apply merker det i stedet for å lage et nytt.`);
        return found;
      }
      const tagged_ = await stripe.products.update(found.id, {
        metadata: { ...found.metadata, app: APP_TAG },
      });
      record("Produkt", "updated", `${tagged_.id}  merket app=${APP_TAG}`);
      return tagged_;
    }
    return found;
  }
  if (!apply) {
    record("Produkt", "planned", PRODUCT_NAME);
    return null;
  }
  const product = await stripe.products.create({
    name: PRODUCT_NAME,
    description:
      "Feltguide for toppturer i Norge: rute, høydemeter, bratthet og skredterreng på ett kart.",
    metadata: { app: APP_TAG },
  });
  record("Produkt", "created", product.id);
  return product;
}

async function ensurePrice(stripe, apply, product, plan) {
  const byLookup = await stripe.prices.list({ lookup_keys: [plan.lookupKey], limit: 10 });
  let found = byLookup.data.find((price) => price.active);
  let adopted = false;

  /* Same adoption as the product, by the only thing a hand-made price can be
     recognised by: it sells our product, in our currency, for our amount, on
     our interval. `lookup_key` is settable after the fact — unlike the amount —
     so an adopted price can be labelled rather than replaced. */
  if (!found && product) {
    const onProduct = await findAll(
      stripe.prices.list({ product: product.id, active: true, limit: 100 }),
      (price) =>
        !price.lookup_key &&
        price.unit_amount === plan.unitAmount &&
        price.currency === CURRENCY &&
        price.recurring?.interval === plan.interval,
    );
    if (onProduct.length) {
      found = onProduct[0];
      adopted = true;
      if (apply) {
        found = await stripe.prices.update(found.id, {
          lookup_key: plan.lookupKey,
          metadata: { ...found.metadata, app: APP_TAG, plan: plan.key },
        });
        record(`Pris ${plan.human}`, "updated", `${found.id}  merket ${plan.lookupKey}`);
        return { price: found, ok: true };
      }
      record(`Pris ${plan.human}`, "exists", `${found.id}  (umerket)`);
      note(`prisen finnes uten lookup_key. --apply merker den som ${plan.lookupKey} framfor å lage en ny.`);
      return { price: found, ok: true };
    }
  }

  if (found && !adopted) {
    /* Prices are immutable in Stripe. If one exists under our lookup key with
       the wrong amount, currency or interval, say so and leave it alone —
       archiving somebody's live price is not this script's call to make. */
    const mismatch =
      found.unit_amount !== plan.unitAmount ||
      found.currency !== CURRENCY ||
      found.recurring?.interval !== plan.interval;
    /* The lookup key is unique per account, not per product, so a price can
       carry ours while hanging off something else entirely. Checkout would
       happily sell that, under that product's name. */
    const foreignProduct = product && idOf(found.product) !== product.id;

    record(
      `Pris ${plan.human}`,
      "exists",
      mismatch || foreignProduct ? `${found.id}  ⚠ avviker` : found.id,
    );
    if (mismatch) {
      warn(
        `forventet ${plan.unitAmount} ${CURRENCY}/${plan.interval}, fant ` +
          `${found.unit_amount} ${found.currency}/${found.recurring?.interval ?? "—"}. ` +
          `Priser kan ikke endres: arkiver den i dashbordet og kjør på nytt.`,
      );
    }
    if (foreignProduct) {
      warn(
        `prisen hører til produkt ${idOf(found.product)}, ikke ${product.id}. ` +
          `Checkout ville solgt det produktet under dets navn.`,
      );
    }
    return { price: found, ok: !mismatch && !foreignProduct };
  }
  if (!apply || !product) {
    record(`Pris ${plan.human}`, "planned", `${plan.unitAmount} ${CURRENCY}/${plan.interval}`);
    return { price: null, ok: false };
  }
  const price = await stripe.prices.create({
    product: product.id,
    currency: CURRENCY,
    unit_amount: plan.unitAmount,
    recurring: { interval: plan.interval },
    lookup_key: plan.lookupKey,
    nickname: plan.nickname,
    metadata: { app: APP_TAG, plan: plan.key },
  });
  record(`Pris ${plan.human}`, "created", price.id);
  return { price, ok: true };
}

/** The portal settings /min-side depends on: change the card, cancel at period
 *  end, read past receipts.
 *
 *  `subscription_update` is deliberately left off. Switching between monthly and
 *  yearly is a product decision with a trial-handling trap behind it (see
 *  docs/deploy.md section 3, step 6), so it stays a dashboard choice rather than
 *  something this script turns on for you.
 *
 *  No `default_return_url`: app/api/portal/route.ts sets `return_url` on every
 *  session from the incoming request's origin, which overrides anything set
 *  here — a value would be dead config that can only go stale.
 */
function portalFeatures(site) {
  return {
    business_profile: {
      privacy_policy_url: `${site}/personvern`,
      terms_of_service_url: `${site}/vilkar`,
    },
    features: {
      customer_update: { enabled: true, allowed_updates: ["email", "address"] },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        cancellation_reason: {
          enabled: true,
          options: ["too_expensive", "missing_features", "unused", "switched_service", "other"],
        },
      },
    },
  };
}

/** Reads an existing configuration against what the app actually needs, and
 *  returns the narrowest update that would fix it — `null` when nothing is
 *  wrong.
 *
 *  Deliberately not a rewrite. A portal somebody set up by hand carries their
 *  choices (which fields customers may edit, whether plans can be switched),
 *  and overwriting those because they are not what this file happens to say
 *  would be the script exceeding its remit. Only two classes get corrected:
 *  features `/min-side` depends on to function at all, and the trial trap,
 *  which charges a customer during a period checkout promised was free.
 */
function auditPortal(config) {
  const features = config.features ?? {};
  const fix = {};

  if (!features.payment_method_update?.enabled) {
    note("«Endre betalingsmetode» er av i portalen — /min-side sender folk dit for nettopp det.");
    fix.payment_method_update = { enabled: true };
  }

  const cancel = features.subscription_cancel ?? {};
  if (!cancel.enabled) {
    note("Oppsigelse er av i portalen — /min-side sender folk dit for det også.");
    fix.subscription_cancel = { enabled: true, mode: "at_period_end" };
  } else if (cancel.mode !== "at_period_end") {
    note(
      `Oppsigelse står på «${cancel.mode}». Tilgangen skal løpe ut perioden som er betalt — ` +
        `grantsAccess() i lib/access.ts regner med det.`,
    );
    fix.subscription_cancel = { enabled: true, mode: "at_period_end" };
  }

  /* The one that costs money. With plan switching on and trials ending on
     update, a customer who moves from monthly to yearly on day 3 of the 14 has
     the trial closed and is invoiced there and then — the opposite of what
     /betaling promised them. Everything else about their subscription_update
     setup is left exactly as it was. */
  const update = features.subscription_update ?? {};
  if (update.enabled && update.trial_update_behavior === "end_trial") {
    note(
      "Portalen avslutter prøveperioden ved planbytte, og fakturerer der og da. " +
        "/betaling lover 0 kr i prøveperioden.",
    );
    fix.subscription_update = {
      enabled: true,
      default_allowed_updates: update.default_allowed_updates ?? ["price"],
      proration_behavior: update.proration_behavior ?? "none",
      trial_update_behavior: "continue_trial",
    };
  }

  if (!features.invoice_history?.enabled) {
    note("Fakturahistorikk er av i portalen — kvitteringene på Min side blir tomme.");
    fix.invoice_history = { enabled: true };
  }

  const profile = config.business_profile ?? {};
  if (!profile.privacy_policy_url || !profile.terms_of_service_url) {
    // Warned, never written. Which pages a portal links to is the operator's
    // call, and both exist in the app whether or not Stripe points at them.
    warn("Portalen lenker ikke til /vilkar og /personvern. Sett dem i dashbordet hvis du vil.");
  }

  return Object.keys(fix).length ? fix : null;
}

async function ensurePortal(stripe, apply, site) {
  const all = await findAll(stripe.billingPortal.configurations.list({ limit: 100 }), () => true);
  /* Prefer one of ours, then the account's default. That fallback is the whole
     point: a portal activated in the dashboard is the default and carries no
     metadata, and creating a second configuration beside it would leave the
     live one — the one sessions actually use — untouched and unfixed. */
  const found = all.find((config) => config.metadata?.app === APP_TAG) ?? all.find((c) => c.is_default);

  if (found) {
    const mine = found.metadata?.app === APP_TAG;
    record("Kundeportal", "exists", `${found.id}${mine ? "" : "  (kontoens standard)"}`);
    const fix = auditPortal(found);
    if (!fix) return found;
    if (!apply) return found;
    const updated = await stripe.billingPortal.configurations.update(found.id, { features: fix });
    record("Kundeportal", "updated", `${updated.id}  ${Object.keys(fix).join(", ")}`);
    return updated;
  }

  if (!apply) {
    record("Kundeportal", "planned", "betalingsmetode + oppsigelse ved periodeslutt");
    return null;
  }
  const config = await stripe.billingPortal.configurations.create({
    ...portalFeatures(site),
    metadata: { app: APP_TAG },
  });
  record("Kundeportal", "created", config.id);
  return config;
}

async function ensureWebhook(stripe, apply, site) {
  const url = `${site}/api/stripe/webhook`;
  const matches = await findAll(
    stripe.webhookEndpoints.list({ limit: 100 }),
    (endpoint) => endpoint.url === url,
  );
  const found = matches[0];

  if (found) {
    /* `enabled_events: ["*"]` is a real configuration, and it does cover every
       event the handler acts on. Treating it as «mangler alle seks» would send
       people to fix an endpoint that works. */
    const catchAll = found.enabled_events.includes("*");
    const missing = catchAll
      ? []
      : WEBHOOK_EVENTS.filter((event) => !found.enabled_events.includes(event));
    if (missing.length && apply) {
      const updated = await stripe.webhookEndpoints.update(found.id, {
        enabled_events: [...new Set([...found.enabled_events, ...WEBHOOK_EVENTS])],
      });
      record("Webhook", "updated", `${updated.id}  +${missing.length} hendelser`);
      return { endpoint: updated, secret: null };
    }
    record("Webhook", "exists", missing.length ? `${found.id}  ⚠ mangler ${missing.join(", ")}` : found.id);
    return { endpoint: found, secret: null };
  }
  if (!apply) {
    record("Webhook", "planned", url);
    return { endpoint: null, secret: null };
  }
  const endpoint = await stripe.webhookEndpoints.create({
    url,
    enabled_events: WEBHOOK_EVENTS,
    description: "Toppkart — synkroniserer abonnementsstatus til Postgres",
    metadata: { app: APP_TAG },
  });
  record("Webhook", "created", endpoint.id);
  // The signing secret is returned once, at creation, and never again.
  return { endpoint, secret: endpoint.secret ?? null };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const USAGE = `
Setter opp en Stripe-konto for Toppkart: produkt, priser, kundeportal og webhook.

  node scripts/stripe-setup.mjs [--apply] [--account acct_...] [--site https://...]

  --apply     Opprett det som mangler. Uten flagget kjører skriptet tørt og
              rapporterer bare hva det ville gjort.
  --account   Avbryt hvis nøkkelen ikke tilhører denne kontoen. Bruk den når du
              har mer enn én Stripe-konto.
  --site      Origin webhooken og de juridiske lenkene bygges fra. Standard er
              NEXT_PUBLIC_SITE_URL, ellers https://toppkart.no.

Nøkkelen leses fra STRIPE_SECRET_KEY, ellers fra .env.local.
`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(USAGE);
    return;
  }

  const fileEnv = readEnvFile(".env.local");
  const secretKey = process.env.STRIPE_SECRET_KEY || fileEnv.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("Fant ingen STRIPE_SECRET_KEY — sett den i miljøet eller i .env.local.");
    process.exit(1);
  }

  const site = (
    args.site ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    fileEnv.NEXT_PUBLIC_SITE_URL ||
    "https://toppkart.no"
  ).replace(/\/+$/, "");

  const stripe = new Stripe(secretKey);

  /* Which account, and is it the live one? Both are printed before anything is
     written, because «hvilken konto var dette igjen» is the whole reason this
     script takes an --account guard. */
  const account = await stripe.accounts.retrieve();
  const live = secretKey.startsWith("sk_live_") || secretKey.startsWith("rk_live_");

  if (args.account && args.account !== account.id) {
    console.error(
      `Nøkkelen tilhører ${account.id} (${account.settings?.dashboard?.display_name ?? "uten navn"}), ` +
        `ikke ${args.account}. Avbryter.`,
    );
    process.exit(1);
  }

  console.log("");
  console.log(`Konto   ${account.id}  ${account.settings?.dashboard?.display_name ?? ""}`);
  console.log(`Modus   ${live ? "LIVE — ekte penger" : "test"}`);
  console.log(`Side    ${site}`);
  console.log(`Priser  ${PLANS.map((plan) => plan.human).join("  ·  ")}`);
  console.log(args.apply ? "\nOppretter det som mangler:\n" : "\nTørrkjøring — ingenting endres:\n");

  const product = await ensureProduct(stripe, args.apply);
  const prices = [];
  for (const plan of PLANS) {
    prices.push({ plan, ...(await ensurePrice(stripe, args.apply, product, plan)) });
  }
  const portal = await ensurePortal(stripe, args.apply, site);
  const { endpoint, secret } = await ensureWebhook(stripe, args.apply, site);

  console.log("");

  const count = (state) => results.filter((result) => result.state === state).length;
  const warned = count("warned");

  if (!args.apply) {
    const planned = count("planned");
    const noted = count("noted");
    /* Three buckets, never collapsed into one: what has to be created, what
       --apply corrects on its own, and what needs a person. Reporting the
       middle group as «skriptet retter dem ikke» sent readers off to fix by
       hand exactly the things the next run would have handled. And never «alt
       er på plass» while any of them is non-zero. */
    if (planned) console.log(`${planned} ting mangler.`);
    if (noted) console.log(`${noted} ting finnes umerket eller feil innstilt — --apply ordner dem.`);
    if (planned || noted) console.log(`Kjør på nytt med --apply.`);
    if (warned) console.log(`${warned} ting krever at du gjør noe selv — se ⚠ over.`);
    if (!planned && !noted && !warned) console.log("Alt er på plass.");
    return;
  }

  console.log("Miljøvariabler — legg dem inn i Vercel (og .env.local lokalt):\n");
  for (const { plan, price, ok } of prices) {
    // A price that failed the check is still printed — it is what the account
    // has — but never as a clean line somebody pastes without reading.
    if (price) console.log(`${plan.envVar}=${price.id}${ok ? "" : "   # ⚠ avviker, se over"}`);
  }
  if (portal?.is_default) {
    // Sessions fall back to the default when the variable is unset, so setting
    // it to the default's own id would be a value that does nothing.
    console.log(`# STRIPE_PORTAL_CONFIGURATION trengs ikke — ${portal.id} er kontoens standard`);
  } else if (portal) {
    console.log(`STRIPE_PORTAL_CONFIGURATION=${portal.id}`);
  }
  if (secret) {
    console.log(`STRIPE_WEBHOOK_SECRET=${secret}`);
  } else if (endpoint) {
    console.log(
      `# STRIPE_WEBHOOK_SECRET — endepunktet fantes fra før, og signeringsnøkkelen\n` +
        `# vises bare når det opprettes. Hent den i dashbordet: ${endpoint.id}`,
    );
  }
  console.log(
    `\nSTRIPE_SECRET_KEY setter du selv — dette skriptet skriver aldri ut nøkkelen det brukte.`,
  );
  // Only the human-shaped ones. Anything this run corrected is done, and
  // repeating it here reads as an outstanding problem it no longer is.
  if (warned) console.log(`\n${warned} ting krever at du gjør noe selv — se ⚠ over.`);
  if (live) {
    console.log(
      `\nDette var live-kontoen. Kjør det samme mot en sandkasse før du tar imot ekte kort.`,
    );
  }
}

main().catch((error) => {
  console.error(`\nFeilet: ${error?.message ?? error}`);
  process.exit(1);
});
