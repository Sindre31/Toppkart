import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/** ESLint, flat config.
 *
 *  `next/core-web-vitals` is the ruleset Next ships and the one its own
 *  diagnostics assume; `next/typescript` adds the TypeScript rules on top.
 *  Both are imported directly rather than through `FlatCompat` — since Next 16
 *  they *are* flat configs, and the compatibility shim chokes on them.
 *
 *  Nothing is added beyond them on purpose. `tsc --noEmit` already runs in CI
 *  and catches the whole class of thing a hand-rolled rule list usually exists
 *  to catch, so what is left for the linter is the React and Next-specific
 *  advice a type checker cannot give: a missing dependency in an effect, an
 *  `<img>` where `next/image` belongs, a hook called somewhere it must not be.
 */
const config = [
  {
    /* `design-reference/` is the read-only prototype handoff and is not shipped;
       `scripts/build-routes/` is Python. Neither is ours to lint. */
    ignores: [".next/**", "node_modules/**", "design-reference/**", "scripts/build-routes/**"],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      /* En parameter som heter `_lang` er allerede merket som ubrukt av den som
         skrev den. `localizeRegion(region, _lang)` tar språket fordi kallerne
         ikke skal måtte vite at regionnavn er egennavn og like på begge språk —
         signaturen er poenget, ikke bruken. Understreken er den vanlige måten å
         si det på, og her får den bety det den ser ut som. */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
