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

import { SITE, VIPPS } from "@/lib/config";
import type { Lang, Translated } from "./index";
import { pick } from "./index";

/** Date the wording last changed. Bump it whenever you edit a paragraph — both
 *  pages print it, and a stale date on a changed policy is worse than none. */
export const LEGAL_UPDATED = "2026-10-16";

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
        "Vilkårene for bruk av Toppkart: en gratis tjeneste uten konto, frivillig støtte med Vipps, og ansvar for egen sikkerhet i fjellet.",
      kicker: "Vilkår",
      title: "Vilkår for bruk",
      lede:
        "Dette er vilkårene for å bruke Toppkart. De gjelder fra du tar tjenesten i bruk, og de er skrevet for å kunne leses.",
      updatedLabel: "Sist oppdatert",
      sections: [
        {
          title: "Om tjenesten",
          body: [
            "Toppkart er en digital feltguide for skiturer i Norge, med rutebeskrivelser, høydeprofil, bratthet, skredterreng og GPX-filer for turene i kartet.",
            "Toppkart er gratis å bruke, og du trenger ingen konto. Alt innhold er åpent for alle.",
            /* Operator. A registered entity's name and address go here. */
            `Toppkart er et lite prosjekt drevet privat, ikke gjennom et registrert selskap. All kontakt går til ${CONTACT}.`,
          ],
        },
        {
          title: "Frivillig støtte",
          body: [
            `Vil du støtte arbeidet med Toppkart, kan du sende et valgfritt beløp med Vipps til ${VIPPS.label}. Det er helt frivillig.`,
            "En støtte er en gave, ikke et kjøp. Den gir ingen ekstra tilgang eller rettigheter, og den forplikter ikke Toppkart til å levere noe bestemt. Alt innhold er åpent uansett om du støtter eller ikke.",
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
            "Du kan bruke innholdet til dine egne turer, laste ned GPX-filer og skrive ut det du trenger. Du kan ikke selge innholdet, kopiere det systematisk eller publisere det på nytt.",
          ],
        },
        {
          title: "Endringer og tilgjengelighet",
          body: [
            "Vi utvikler tjenesten løpende, og kan endre, legge til eller fjerne innhold og funksjoner.",
            "Vi tar sikte på at tjenesten er tilgjengelig hele tiden, men kan ikke garantere det.",
            "Vi kan endre disse vilkårene. Datoen øverst på siden viser når de sist ble endret.",
          ],
        },
        {
          title: "Lovvalg og tvister",
          body: [
            "Vilkårene er underlagt norsk rett.",
            `Er du uenig i noe, ta først kontakt på ${CONTACT}. Det meste lar seg løse der.`,
            "Tvister som ikke løses i minnelighet, kan bringes inn for de alminnelige domstolene. Som forbruker kan du reise sak ved ditt eget verneting.",
          ],
        },
      ],
    },

    privacy: {
      metaTitle: "Personvern",
      metaDescription:
        "Hvilke opplysninger Toppkart lagrer, hvorfor, hvem vi deler dem med, og hvilke rettigheter du har.",
      kicker: "Personvern",
      title: "Personvernerklæring",
      lede:
        "Toppkart har ingen kontoer og samler inn så lite som mulig. Favorittene dine og turene du har gått, ligger på din egen enhet. Vi selger ikke opplysninger, og vi driver ikke annonsering.",
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
            "Du trenger ingen konto for å bruke Toppkart, og vi vet ikke hvem du er.",
            "Skriver du i tilbakemeldingsboksen: teksten du sendte og hvilken side du sto på. Sammen med den lagrer vi en teller for å hindre at noen sender tusen meldinger på rad. Telleren står på en kryptografisk omskriving av IP-adressen din — en enveisverdi vi ikke kan regne tilbake til en adresse — og den slettes etter et døgn. Selve IP-adressen lagres ikke.",
            "Utover det lagrer vi ingen opplysninger om hvilke turer du ser på, og ingen posisjonsdata. Trykker du «Nær meg» eller posisjonsknappen på kartet, spør nettleseren deg om lov til å dele posisjonen. Den brukes bare i nettleseren din — til å vise hvor du står og sortere turene etter avstand — og sendes aldri til oss. Uten det trykket ber appen aldri om posisjonen din.",
            `Støtter du Toppkart med Vipps, behandler Vipps betalingen. Vi ser navnet ditt, beløpet og eventuell melding i Vipps-appen, slik alle som mottar en Vipps gjør, og bruker det ikke til noe annet.`,
          ],
        },
        {
          title: "Det som ligger på enheten din",
          body: [
            "Merker du en tur som favoritt eller som gått, lagres det i nettleseren på enheten din — hvilken tur det er, og datoen du merket den som gått. Det sendes aldri til oss, og det følger ikke med til en annen enhet. Du fjerner en markering ved å trykke på knappen igjen.",
            "Trykker du «Lagre offline» på en turguide, lagres guiden, kartbildene langs ruta og GPX-fila i nettleseren på enheten din, så de virker uten dekning. Du fjerner den med «Fjern» på guiden.",
            "Nettleseren husker også hvor mange ganger du har åpnet appen, slik at spørsmålet om støtte kommer én gang — den tredje gangen — og aldri igjen.",
            "Alt dette slettes når du tømmer nettstedsdataene for Toppkart i nettleseren.",
          ],
        },
        {
          title: "Hvorfor, og med hvilket grunnlag",
          body: [
            "Tilbakemeldinger behandler vi fordi du har sendt dem til oss, for å kunne lese og følge dem opp. Telleren mot misbruk behandler vi for å holde tjenesten i drift. Grunnlaget er vår berettigede interesse — personvernforordningen artikkel 6 nr. 1 bokstav f.",
          ],
        },
        {
          title: "Hvem vi deler med",
          body: [
            "Vi bruker noen leverandører som behandler opplysninger på våre vegne. Vi selger ikke opplysninger videre til noen.",
            "Supabase leverer databasen. Vercel drifter nettsiden og gir oss enkel besøksstatistikk. Google står for skriftsnittene siden bruker.",
            "Noen av disse er amerikanske selskaper. Overføring av opplysninger ut av EØS skjer på EU-kommisjonens standard personvernbestemmelser eller under EUs personvernrammeverk for USA.",
          ],
        },
        {
          title: "Informasjonskapsler",
          body: [
            "Vi bruker ingen informasjonskapsler til sporing eller annonsering, og har derfor heller ikke noe samtykkebanner.",
            "Nødvendige kapsler: «tk_lang», som husker språkvalget ditt i ett år.",
            "Besøksstatistikken fra Vercel Analytics setter ingen informasjonskapsel og følger deg ikke mellom nettsteder. Den teller sidevisninger på pseudonymt grunnlag.",
            "Skriftsnittene lastes fra Google Fonts. Det innebærer at IP-adressen din er synlig for Google når en side lastes.",
          ],
        },
        {
          title: "Hvor lenge vi lagrer",
          body: [
            "Tilbakemeldinger beholdes så lenge de er nyttige for å forbedre tjenesten. Vil du ha en melding slettet, skriv til oss.",
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
            "Endrer vi denne erklæringen, oppdaterer vi datoen øverst på siden.",
          ],
        },
      ],
    },
  },

  en: {
    terms: {
      metaTitle: "Terms of service",
      metaDescription:
        "The terms for using Toppkart: a free service with no account, voluntary support through Vipps, and responsibility for your own safety in the mountains.",
      kicker: "Terms",
      title: "Terms of service",
      lede:
        "These are the terms for using Toppkart. They apply from the moment you start using the service, and they are written to be read.",
      updatedLabel: "Last updated",
      sections: [
        {
          title: "The service",
          body: [
            "Toppkart is a digital field guide to ski touring in Norway, with route descriptions, elevation profiles, steepness, avalanche terrain and GPX files for the tours on the map.",
            "Toppkart is free to use, and you need no account. All content is open to everyone.",
            /* Operator. A registered entity's name and address go here. */
            `Toppkart is a small project run privately, not through a registered company. All contact goes to ${CONTACT}.`,
          ],
        },
        {
          title: "Voluntary support",
          body: [
            `If you want to support the work on Toppkart, you can send an amount of your choice with Vipps to ${VIPPS.label}. It is entirely voluntary.`,
            "A contribution is a gift, not a purchase. It gives no extra access or rights, and it does not commit Toppkart to deliver anything in particular. All content is open whether you contribute or not.",
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
            "You may use the content for your own tours, download GPX files and print what you need. You may not sell the content, copy it systematically or republish it.",
          ],
        },
        {
          title: "Changes and availability",
          body: [
            "We develop the service continuously and may change, add or remove content and features.",
            "We aim for the service to be available at all times, but cannot guarantee it.",
            "We may change these terms. The date at the top of the page shows when they last changed.",
          ],
        },
        {
          title: "Governing law and disputes",
          body: [
            "These terms are governed by Norwegian law.",
            `If you disagree with something, contact us first at ${CONTACT}. Most things are resolved there.`,
            "Disputes not resolved amicably may be brought before the ordinary courts. As a consumer you may bring proceedings in your own local venue.",
          ],
        },
      ],
    },

    privacy: {
      metaTitle: "Privacy",
      metaDescription:
        "What Toppkart stores, why, who we share it with, and the rights you have.",
      kicker: "Privacy",
      title: "Privacy notice",
      lede:
        "Toppkart has no accounts and collects as little as it can. Your favourites and the tours you have done stay on your own device. We do not sell data, and we do not run advertising.",
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
            "You need no account to use Toppkart, and we do not know who you are.",
            "If you write in the feedback box: the text you sent and the page you were on. Alongside it we keep a counter, so that nobody can send a thousand messages in a row. The counter is kept against a cryptographic rewriting of your IP address — a one-way value we cannot turn back into an address — and it is deleted after a day. The IP address itself is not stored.",
            "Beyond that, we store nothing about which tours you look at, and no location data. If you press «Near me» or the location button on the map, your browser asks your permission to share your position. It is used only in your browser — to show where you are and sort the tours by distance — and is never sent to us. Without that press the app never asks for your position.",
            "If you support Toppkart with Vipps, Vipps processes the payment. We see your name, the amount and any message in the Vipps app, as anyone receiving a Vipps does, and use it for nothing else.",
          ],
        },
        {
          title: "What stays on your device",
          body: [
            "If you mark a tour as a favourite or as done, it is stored in the browser on your device — which tour it is, and the date you marked it done. It is never sent to us, and it does not follow you to another device. You remove a mark by pressing the button again.",
            "If you press «Save offline» on a guide, the guide, the map images along the route and the GPX file are stored in the browser on your device, so they work without coverage. You remove it with «Remove» on the guide.",
            "The browser also remembers how many times you have opened the app, so that the question about support comes once — the third time — and never again.",
            "All of this is deleted when you clear the site data for Toppkart in your browser.",
          ],
        },
        {
          title: "Why, and on what basis",
          body: [
            "We process feedback because you sent it to us, in order to read it and follow it up. We process the abuse counter to keep the service running. The basis is our legitimate interest — GDPR article 6(1)(f).",
          ],
        },
        {
          title: "Who we share it with",
          body: [
            "We use a handful of providers who process data on our behalf. We do not sell data on to anyone.",
            "Supabase provides the database. Vercel hosts the site and gives us basic visitor statistics. Google provides the typefaces the site uses.",
            "Some of these are US companies. Transfers outside the EEA rely on the European Commission's standard contractual clauses or on the EU–US Data Privacy Framework.",
          ],
        },
        {
          title: "Cookies",
          body: [
            "We use no cookies for tracking or advertising, and therefore have no consent banner.",
            "Necessary cookies: «tk_lang», which remembers your language choice for a year.",
            "The visitor statistics from Vercel Analytics set no cookie and do not follow you between sites. They count page views on a pseudonymous basis.",
            "Typefaces are loaded from Google Fonts, which means your IP address is visible to Google when a page loads.",
          ],
        },
        {
          title: "How long we keep it",
          body: [
            "Feedback is kept for as long as it is useful for improving the service. If you want a message deleted, write to us.",
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
            "If we change this notice we update the date at the top of the page.",
          ],
        },
      ],
    },
  },
};

export function legalDict(lang: Lang): LegalDict {
  return pick(LEGAL_TEXT, lang);
}
