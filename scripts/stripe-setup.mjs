#!/usr/bin/env node
/** Provisions a Stripe account for Toppkart: product, prices, customer portal
 *  and webhook endpoint.
 *
 *  Everything `docs/deploy.md` section 3 asks you to click together in the
 *  dashboard, done from code instead — so a fresh Stripe account can be brought
 *  up in one command, the same way twice, and so the settings the app depends on
 *  are written down rather than remembered.
 *
 *  It is idempotent. Objects it has created before are recognised by
 *  `metadata.app = "toppkart"` (product, portal configuration), by lookup key
 *  (prices) or by URL (webhook endpoint), so a second run reports «finnes» and
 *  changes nothing. It never deletes or archives anything.
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

/** Something that exists but is not what the app needs. Tracked apart from
 *  `planned`, because a run that finds a wrong price has nothing to create and
 *  would otherwise report «alt er på plass». */
function warn(message) {
  results.push({ state: "warned" });
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

async function ensureProduct(stripe, apply) {
  const matches = await findAll(
    stripe.products.list({ limit: 100, active: true }),
    (product) => product.metadata?.app === APP_TAG,
  );
  const found = matches[0];
  if (found) {
    record("Produkt", "exists", found.id);
    if (matches.length > 1) {
      warn(`${matches.length} produkter er merket app=${APP_TAG}. Bruker ${found.id}; rydd opp i resten.`);
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
  const found = byLookup.data.find((price) => price.active);
  if (found) {
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

async function ensurePortal(stripe, apply, site) {
  const matches = await findAll(
    stripe.billingPortal.configurations.list({ limit: 100 }),
    (config) => config.metadata?.app === APP_TAG,
  );
  const found = matches[0];
  const params = portalFeatures(site);

  if (found) {
    if (!apply) {
      record("Kundeportal", "exists", found.id);
      return found;
    }
    /* Re-applied on every --apply run so the configuration follows this file
       rather than whatever it drifted into. */
    const updated = await stripe.billingPortal.configurations.update(found.id, params);
    record("Kundeportal", "updated", updated.id);
    return updated;
  }
  if (!apply) {
    record("Kundeportal", "planned", "betalingsmetode + oppsigelse ved periodeslutt");
    return null;
  }
  const config = await stripe.billingPortal.configurations.create({
    ...params,
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

  const warned = results.filter((result) => result.state === "warned").length;

  if (!args.apply) {
    const planned = results.filter((result) => result.state === "planned").length;
    /* Both numbers, and never «alt er på plass» while an ⚠ is on screen: a
       price with the wrong amount has nothing to create, so counting only what
       is missing would call that account finished. */
    if (planned) console.log(`${planned} ting mangler. Kjør på nytt med --apply for å opprette dem.`);
    if (warned) console.log(`${warned} ting finnes, men avviker — se ⚠ over. Skriptet retter dem ikke.`);
    if (!planned && !warned) console.log("Alt er på plass.");
    return;
  }

  console.log("Miljøvariabler — legg dem inn i Vercel (og .env.local lokalt):\n");
  for (const { plan, price, ok } of prices) {
    // A price that failed the check is still printed — it is what the account
    // has — but never as a clean line somebody pastes without reading.
    if (price) console.log(`${plan.envVar}=${price.id}${ok ? "" : "   # ⚠ avviker, se over"}`);
  }
  if (portal) console.log(`STRIPE_PORTAL_CONFIGURATION=${portal.id}`);
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
  if (warned) {
    console.log(`\n${warned} ting finnes, men avviker — se ⚠ over. Skriptet retter dem ikke.`);
  }
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
