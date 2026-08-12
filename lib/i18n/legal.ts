/** NO/EN dictionary for the two legal pages — `/vilkar` and `/personvern`.
 *
 *  These are the only pages in the app whose wording carries legal weight, so
 *  two rules apply that the rest of the copy does not have to think about:
 *
 *  1. **Every claim here must be true of the code.** The privacy notice lists
 *     the processors the app actually calls and the fields it actually stores;
 *     if you add an analytics script, a new table or a third-party embed, this
 *     file is part of that change, not a follow-up to it.
 *  2. **The two languages must say the same thing.** The English column is a
 *     translation, not a second draft. A discrepancy between them is a
 *     discrepancy in what you have promised.
 *
 *  No company stands behind the service yet, so the operator and controller
 *  paragraphs name Toppkart itself and route everything to `SITE.supportEmail`.
 *  Both are marked below; if a registered entity ever takes over, its name and
 *  address belong in those two paragraphs and nowhere else.
 *
 *  Structure mirrors `guide.ts`: a document is a header plus numbered sections
 *  of plain paragraphs. No markup inside a paragraph — `LegalDocument` renders
 *  each string as its own `<p>`, which keeps the copy free of HTML and the
 *  translation honest.
 */

import { PRICE, SITE, TRIAL_DAYS } from "@/lib/config";
import type { Lang, Translated } from "./index";
import { pick } from "./index";

/** Date the wording last changed. Bump it whenever you edit a paragraph — both
 *  pages print it, and a stale date on a changed policy is worse than none. */
export const LEGAL_UPDATED = "2026-08-12";

export interface LegalSection {
  /** Rendered through `SectionKicker`, numbered by the page. */
  title: string;
  /** One string per paragraph. Plain text, no markup. */
  body: string[];
}

export interface LegalDocument {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  lede: string;
  /** Precedes the formatted `LEGAL_UPDATED` date. */
  updatedLabel: string;
  sections: LegalSection[];
}

export interface LegalDict {
  terms: LegalDocument;
  privacy: LegalDocument;
}

const CONTACT = SITE.supportEmail;

const LEGAL_TEXT: Translated<LegalDict> = {
  no: {
    terms: {
      metaTitle: "Vilkår for bruk",
      metaDescription:
        "Vilkårene for abonnement på Toppkart: pris, prøveperiode, oppsigelse, angrerett og ansvar for egen sikkerhet i fjellet.",
      kicker: "Vilkår",
      title: "Vilkår for bruk",
      lede:
        "Dette er avtalen mellom deg og Toppkart. Den gjelder fra du oppretter konto, og den er skrevet for å kunne leses.",
      updatedLabel: "Sist oppdatert",
      sections: [
        {
          title: "Om tjenesten",
          body: [
            "Toppkart er en digital feltguide for skiturer i Norge. Abonnementet gir tilgang til rutebeskrivelser, høydeprofil, bratthet, skredterreng og GPX-filer for turene i kartet.",
            /* Operator. A registered entity's name and address go here. */
            `Toppkart er et lite prosjekt drevet privat, ikke gjennom et registrert selskap. All kontakt går til ${CONTACT}, og henvendelser om abonnement, oppsigelse og denne avtalen besvares derfra.`,
          ],
        },
        {
          title: "Konto",
          body: [
            "Du oppretter konto ved å logge inn med Google. Det finnes ingen annen innlogging, og vi mottar aldri passordet ditt.",
            "Kontoen er personlig. Du er ansvarlig for det som skjer gjennom din innlogging, og for at Google-kontoen du bruker er din egen.",
            "Du må være 18 år for å inngå avtale om abonnement på egen hånd.",
          ],
        },
        {
          title: "Abonnement og pris",
          body: [
            `Abonnementet koster ${PRICE.monthly.amount} kr per måned eller ${PRICE.yearly.amount} kr per år. Det er hele prisen — ingenting kommer i tillegg.`,
            `Nye kunder får ${TRIAL_DAYS} dager gratis. Du må registrere et betalingskort når du starter, men kortet belastes ikke i prøveperioden.`,
            "Etter prøveperioden fornyes abonnementet automatisk ved utløpet av hver periode, til du sier det opp. Betalingen trekkes fra kortet du har registrert.",
            "Vi kan endre prisen. Du får beskjed på e-post minst 30 dager før en endring trer i kraft, og du kan si opp før den gjelder.",
          ],
        },
        {
          title: "Oppsigelse og angrerett",
          body: [
            "Du kan si opp når som helst fra Min side. Oppsigelsen trer i kraft ved utløpet av perioden du har betalt for, og du beholder tilgangen ut den perioden.",
            "Sier du opp i prøveperioden, blir kortet aldri belastet.",
            "Vi refunderer ikke en påbegynt periode. Det er noe av grunnen til at prøveperioden finnes: den skal gi deg tid til å avgjøre om tjenesten er noe for deg før du betaler for den.",
            `Som forbruker har du 14 dagers angrerett etter angrerettloven, regnet fra avtalen inngås. Prøveperioden er like lang og koster ingenting, så i praksis rekker du å ombestemme deg uten å ha betalt. Vil du bruke angreretten formelt, holder det å sende en melding til ${CONTACT}.`,
          ],
        },
        {
          title: "Sikkerhet i fjellet",
          body: [
            "Toppkart er et planleggingsverktøy, ikke en garanti for at en tur er trygg. Innholdet beskriver terrenget slik det er beregnet fra Kartverkets høydemodell, og slik det ble vurdert da guiden ble skrevet.",
            "Forholdene endrer seg fra dag til dag og fra time til time. Snødekke, skredfare, vær, sikt og føre på den dagen du går, er ikke noe Toppkart kan vite noe om.",
            "Du har selv ansvaret for turen du velger, for vurderingene du gjør underveis og for å snu. Sjekk alltid skredvarselet på varsom.no og et oppdatert værvarsel før du drar, og gå ikke i skredterreng uten nødvendig kompetanse og utstyr.",
            "Rutene i kartet er generert geometri, ikke innspilte spor. De kan avvike fra terrenget, og de er ikke tilstrekkelig navigasjonsgrunnlag alene. Ta med kart og kompass.",
            "Toppkart er ikke ansvarlig for skade, tap eller ulykke som følger av bruk av tjenesten. Denne begrensningen gjelder ikke ved forsett eller grov uaktsomhet, og den innskrenker ikke rettigheter du har som forbruker etter ufravikelig lovgivning.",
          ],
        },
        {
          title: "Innholdet",
          body: [
            "Tekst, kart, ruter, bilder og data i Toppkart er beskyttet av opphavsrett, og tilhører Toppkart eller våre lisensgivere. Høydedata og kartgrunnlag kommer fra Kartverket.",
            "Abonnementet gir deg en personlig bruksrett. Du kan bruke innholdet til dine egne turer, laste ned GPX-filer og skrive ut det du trenger. Du kan ikke videreselge innholdet, kopiere det systematisk, publisere det på nytt eller dele innloggingen din med andre.",
          ],
        },
        {
          title: "Endringer og tilgjengelighet",
          body: [
            "Vi utvikler tjenesten løpende, og kan endre, legge til eller fjerne innhold og funksjoner.",
            "Vi tar sikte på at tjenesten er tilgjengelig hele tiden, men kan ikke garantere det. Planlagt vedlikehold varsles når det lar seg gjøre.",
            "Vi kan endre disse vilkårene. Ved endringer av betydning varsler vi på e-post minst 30 dager før de trer i kraft.",
          ],
        },
        {
          title: "Mislighold",
          body: [
            "Vi kan stenge en konto som bryter vilkårene — særlig ved deling av innlogging eller systematisk kopiering av innholdet. Ved stenging refunderer vi den gjenstående delen av en betalt periode, med mindre bruddet er grovt.",
          ],
        },
        {
          title: "Lovvalg og tvister",
          body: [
            "Avtalen er underlagt norsk rett.",
            `Er du uenig i noe, ta først kontakt på ${CONTACT}. Det meste lar seg løse der. Kommer vi ikke i mål, kan du bringe saken inn for Forbrukertilsynet, som mekler i forbrukersaker.`,
            "Tvister som ikke løses i minnelighet, kan bringes inn for de alminnelige domstolene. Som forbruker kan du reise sak ved ditt eget verneting.",
          ],
        },
      ],
    },

    privacy: {
      metaTitle: "Personvern",
      metaDescription:
        "Hvilke opplysninger Toppkart lagrer om deg, hvorfor, hvem vi deler dem med, og hvilke rettigheter du har.",
      kicker: "Personvern",
      title: "Personvernerklæring",
      lede:
        "Toppkart samler inn så lite som mulig: e-postadressen din fra Google-innloggingen, og det som skal til for å holde styr på abonnementet. Vi selger ikke opplysninger, og vi driver ikke annonsering.",
      updatedLabel: "Sist oppdatert",
      sections: [
        {
          title: "Behandlingsansvarlig",
          body: [
            /* Controller. A registered entity's name and address go here. */
            "Toppkart er behandlingsansvarlig for opplysningene som beskrives her. Tjenesten drives privat, ikke gjennom et registrert selskap.",
            `Spørsmål om personvern, og forespørsler om innsyn eller sletting, går til ${CONTACT}.`,
          ],
        },
        {
          title: "Hva vi lagrer",
          body: [
            "Fra innloggingen: e-postadressen på Google-kontoen du logger inn med, og hvilket språk du har valgt. Selve innloggingen skjer hos Google, og vi mottar aldri passordet ditt.",
            "Fra abonnementet: status, hvilken plan du har, når inneværende periode løper ut, når prøveperioden slutter, og kunde- og abonnementsnummeret ditt hos Stripe.",
            "Om betalingskortet lagrer vi korttype, de fire siste sifrene og utløpsmåned — nok til at du kjenner igjen kortet på Min side. Vi ser aldri det fulle kortnummeret. Kortet oppgis på Stripes egne sider, og opplysningene passerer aldri gjennom Toppkart.",
            "Kvitteringer: beløp, valuta, status og lenke til fakturaen hos Stripe, speilet hos oss så Min side kan vise historikken.",
            "Skriver du i tilbakemeldingsboksen: teksten du sendte, hvilken side du sto på, og adressa di dersom du var innlogget. Sammen med den lagrer vi en teller for å hindre at noen sender tusen meldinger på rad. Telleren står på en kryptografisk omskriving av IP-adressen din — en enveisverdi vi ikke kan regne tilbake til en adresse — og den slettes etter et døgn. Selve IP-adressen lagres ikke.",
            "Vi lagrer ingen opplysninger om hvilke turer du ser på, og ingen posisjonsdata. Appen ber aldri om posisjonen din.",
          ],
        },
        {
          title: "Hvorfor, og med hvilket grunnlag",
          body: [
            "Vi behandler opplysningene for å levere tjenesten du har bestilt, holde styr på abonnementet, og sende deg kvittering og beskjed når prøveperioden nærmer seg slutten. Det rettslige grunnlaget er avtalen med deg — personvernforordningen artikkel 6 nr. 1 bokstav b.",
            "Fakturaer og regnskapsmateriale behandler vi fordi bokføringsloven krever det — artikkel 6 nr. 1 bokstav c.",
          ],
        },
        {
          title: "Hvem vi deler med",
          body: [
            "Vi bruker noen leverandører som behandler opplysninger på våre vegne. Vi selger ikke opplysninger videre til noen.",
            "Supabase leverer database og innlogging. Stripe håndterer betaling og abonnement. Resend sender kvitteringer og varsler på e-post. Vercel drifter nettsiden og gir oss enkel besøksstatistikk. Google står for innloggingen og for skriftsnittene siden bruker.",
            "Noen av disse er amerikanske selskaper. Overføring av opplysninger ut av EØS skjer på EU-kommisjonens standard personvernbestemmelser eller under EUs personvernrammeverk for USA.",
          ],
        },
        {
          title: "Informasjonskapsler",
          body: [
            "Vi bruker ingen informasjonskapsler til sporing eller annonsering, og har derfor heller ikke noe samtykkebanner.",
            "Nødvendige kapsler: en innloggingskapsel fra Supabase som holder deg innlogget, og «tk_lang», som husker språkvalget ditt i ett år.",
            "Besøksstatistikken fra Vercel Analytics setter ingen informasjonskapsel og følger deg ikke mellom nettsteder. Den teller sidevisninger på pseudonymt grunnlag.",
            "Skriftsnittene lastes fra Google Fonts. Det innebærer at IP-adressen din er synlig for Google når en side lastes.",
          ],
        },
        {
          title: "Hvor lenge vi lagrer",
          body: [
            `Konto og abonnementsdata beholdes så lenge du har konto hos oss. Det finnes ingen slett-knapp på Min side; be om sletting ved å skrive til ${CONTACT}, så fjerner vi profilen, abonnementsdataene og tilbakemeldingene dine.`,
            "Fakturaer og annet regnskapsmateriale oppbevares i fem år etter regnskapsårets slutt, slik bokføringsloven krever. Det gjelder også etter at kontoen er slettet.",
          ],
        },
        {
          title: "Dine rettigheter",
          body: [
            "Du har rett til innsyn i hva vi har lagret om deg, til å få rettet feil, til å få opplysninger slettet, til å få dem utlevert i et maskinlesbart format, og til å protestere mot behandlingen.",
            `Be om det ved å skrive til ${CONTACT}. Vi svarer innen 30 dager.`,
            "Er du misfornøyd med hvordan vi behandler opplysningene dine, kan du klage til Datatilsynet.",
          ],
        },
        {
          title: "Endringer",
          body: [
            "Endrer vi denne erklæringen, oppdaterer vi datoen øverst på siden. Ved endringer av betydning varsler vi deg på e-post.",
          ],
        },
      ],
    },
  },

  en: {
    terms: {
      metaTitle: "Terms of service",
      metaDescription:
        "The terms of a Toppkart subscription: price, free trial, cancellation, right of withdrawal, and responsibility for your own safety in the mountains.",
      kicker: "Terms",
      title: "Terms of service",
      lede:
        "This is the agreement between you and Toppkart. It applies from the moment you create an account, and it is written to be read.",
      updatedLabel: "Last updated",
      sections: [
        {
          title: "The service",
          body: [
            "Toppkart is a digital field guide to ski touring in Norway. A subscription gives you route descriptions, elevation profiles, steepness, avalanche terrain and GPX files for the tours on the map.",
            /* Operator. A registered entity's name and address go here. */
            `Toppkart is a small project run privately, not through a registered company. All contact goes to ${CONTACT}, and questions about subscriptions, cancellation and this agreement are answered from there.`,
          ],
        },
        {
          title: "Your account",
          body: [
            "You create an account by signing in with Google. There is no other way in, and we never receive your password.",
            "The account is personal. You are responsible for what happens through your sign-in, and for the Google account you use being your own.",
            "You must be 18 to enter into a subscription agreement on your own.",
          ],
        },
        {
          title: "Subscription and price",
          body: [
            `The subscription costs ${PRICE.monthly.amount} NOK per month or ${PRICE.yearly.amount} NOK per year. That is the whole price — nothing is added on top.`,
            `New customers get ${TRIAL_DAYS} days free. You have to register a payment card when you start, but the card is not charged during the trial.`,
            "After the trial the subscription renews automatically at the end of each period until you cancel. Payment is taken from the card you registered.",
            "We may change the price. You will be told by e-mail at least 30 days before a change takes effect, and you can cancel before it applies.",
          ],
        },
        {
          title: "Cancellation and withdrawal",
          body: [
            "You can cancel at any time from My account. Cancellation takes effect at the end of the period you have paid for, and you keep access until then.",
            "Cancel during the trial and the card is never charged.",
            "We do not refund a period already begun. That is part of why the trial exists: it is meant to give you time to decide whether the service is for you before you pay for it.",
            `As a consumer you have a 14-day right of withdrawal under the Norwegian Right of Withdrawal Act, counted from when the agreement is made. The trial is the same length and costs nothing, so in practice you have time to change your mind without having paid. To exercise the right formally, a message to ${CONTACT} is enough.`,
          ],
        },
        {
          title: "Safety in the mountains",
          body: [
            "Toppkart is a planning tool, not a guarantee that a tour is safe. The content describes terrain as computed from the Norwegian Mapping Authority's elevation model, and as assessed when the guide was written.",
            "Conditions change from day to day and from hour to hour. The snowpack, avalanche danger, weather, visibility and surface on the day you go are not things Toppkart can know anything about.",
            "You are responsible for the tour you choose, for the judgements you make on the way, and for turning back. Always check the avalanche forecast at varsom.no and a current weather forecast before you leave, and do not enter avalanche terrain without the competence and equipment it requires.",
            "The routes on the map are generated geometry, not recorded tracks. They can deviate from the terrain, and they are not sufficient grounds for navigation on their own. Bring a map and a compass.",
            "Toppkart is not liable for injury, loss or accident arising from use of the service. This limitation does not apply to intent or gross negligence, and it does not restrict rights you hold as a consumer under mandatory law.",
          ],
        },
        {
          title: "The content",
          body: [
            "Text, maps, routes, images and data in Toppkart are protected by copyright and belong to Toppkart or our licensors. Elevation data and map material come from the Norwegian Mapping Authority.",
            "The subscription gives you a personal right of use. You may use the content for your own tours, download GPX files and print what you need. You may not resell the content, copy it systematically, republish it, or share your sign-in with others.",
          ],
        },
        {
          title: "Changes and availability",
          body: [
            "We develop the service continuously and may change, add or remove content and features.",
            "We aim for the service to be available at all times, but cannot guarantee it. Planned maintenance is announced where practicable.",
            "We may change these terms. For changes of significance we will give notice by e-mail at least 30 days before they take effect.",
          ],
        },
        {
          title: "Breach",
          body: [
            "We may close an account that breaches these terms — particularly for shared sign-ins or systematic copying of the content. On closure we refund the remaining part of a paid period, unless the breach is serious.",
          ],
        },
        {
          title: "Governing law and disputes",
          body: [
            "The agreement is governed by Norwegian law.",
            `If you disagree with something, contact us first at ${CONTACT}. Most things are resolved there. If we cannot settle it, you may bring the matter to the Norwegian Consumer Authority, which mediates in consumer cases.`,
            "Disputes not resolved amicably may be brought before the ordinary courts. As a consumer you may bring proceedings in your own local venue.",
          ],
        },
      ],
    },

    privacy: {
      metaTitle: "Privacy",
      metaDescription:
        "What Toppkart stores about you, why, who we share it with, and the rights you have.",
      kicker: "Privacy",
      title: "Privacy notice",
      lede:
        "Toppkart collects as little as it can: your e-mail address from the Google sign-in, and what it takes to keep track of your subscription. We do not sell data, and we do not run advertising.",
      updatedLabel: "Last updated",
      sections: [
        {
          title: "Data controller",
          body: [
            /* Controller. A registered entity's name and address go here. */
            "Toppkart is the controller for the data described here. The service is run privately, not through a registered company.",
            `Questions about privacy, and requests for access or deletion, go to ${CONTACT}.`,
          ],
        },
        {
          title: "What we store",
          body: [
            "From the sign-in: the e-mail address on the Google account you sign in with, and the language you have chosen. The sign-in itself happens at Google, and we never receive your password.",
            "From the subscription: its status, which plan you are on, when the current period ends, when the trial ends, and your customer and subscription identifiers at Stripe.",
            "About the payment card we store the card type, the last four digits and the expiry month — enough for you to recognise the card on My account. We never see the full card number. The card is entered on Stripe's own pages and the details never pass through Toppkart.",
            "Receipts: amount, currency, status and a link to the invoice at Stripe, mirrored on our side so My account can show the history.",
            "If you write in the feedback box: the text you sent, the page you were on, and your address if you were signed in. Alongside it we keep a counter, so that nobody can send a thousand messages in a row. The counter is kept against a cryptographic rewriting of your IP address — a one-way value we cannot turn back into an address — and it is deleted after a day. The IP address itself is not stored.",
            "We store nothing about which tours you look at, and no location data. The app never asks for your position.",
          ],
        },
        {
          title: "Why, and on what basis",
          body: [
            "We process the data to deliver the service you ordered, to keep track of the subscription, and to send you receipts and notice when the trial is coming to an end. The legal basis is the contract with you — GDPR article 6(1)(b).",
            "Invoices and accounting material are processed because the Norwegian Bookkeeping Act requires it — article 6(1)(c).",
          ],
        },
        {
          title: "Who we share it with",
          body: [
            "We use a handful of providers who process data on our behalf. We do not sell data on to anyone.",
            "Supabase provides the database and sign-in. Stripe handles payment and subscriptions. Resend sends receipts and notices by e-mail. Vercel hosts the site and gives us basic visitor statistics. Google provides the sign-in and the typefaces the site uses.",
            "Some of these are US companies. Transfers outside the EEA rely on the European Commission's standard contractual clauses or on the EU–US Data Privacy Framework.",
          ],
        },
        {
          title: "Cookies",
          body: [
            "We use no cookies for tracking or advertising, and therefore have no consent banner.",
            "Necessary cookies: a sign-in cookie from Supabase that keeps you signed in, and «tk_lang», which remembers your language choice for a year.",
            "The visitor statistics from Vercel Analytics set no cookie and do not follow you between sites. They count page views on a pseudonymous basis.",
            "Typefaces are loaded from Google Fonts, which means your IP address is visible to Google when a page loads.",
          ],
        },
        {
          title: "How long we keep it",
          body: [
            `Account and subscription data are kept for as long as you have an account with us. There is no delete button on My account; ask for deletion by writing to ${CONTACT}, and we will remove your profile, your subscription data and your feedback.`,
            "Invoices and other accounting material are kept for five years after the end of the financial year, as the Bookkeeping Act requires. That applies after the account has been deleted too.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "You have the right to see what we hold about you, to have errors corrected, to have data deleted, to receive it in a machine-readable format, and to object to the processing.",
            `Ask by writing to ${CONTACT}. We reply within 30 days.`,
            "If you are unhappy with how we handle your data, you may complain to the Norwegian Data Protection Authority (Datatilsynet).",
          ],
        },
        {
          title: "Changes",
          body: [
            "If we change this notice we update the date at the top of the page. For changes of significance we will tell you by e-mail.",
          ],
        },
      ],
    },
  },
};

export function legalDict(lang: Lang): LegalDict {
  return pick(LEGAL_TEXT, lang);
}
