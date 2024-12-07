import { expect, it } from "vitest";
import { Matcher } from "./matcher";

it("should correctly find matches", () => {
  const text = "abracadabra is magical.";
  const strings = ["abra", "cad", "mag", "abdul", "cadbul"];
  const regexPatterns = ["\\w{5}", /ical\.$/];

  const matcher = new Matcher(strings, regexPatterns);
  const matches = matcher.findMatches(text);

  expect(
    matches.map((match) => ({ ...match, regexp: match.regexp?.toString() })),
  ).toEqual([
    { match: "abra", start: 0, end: 3, regexp: undefined },
    { match: "cad", start: 4, end: 6, regexp: undefined },
    { match: "abra", start: 7, end: 10, regexp: undefined },
    { match: "mag", start: 15, end: 17, regexp: undefined },
    { match: "abrac", start: 0, end: 4, regexp: "/\\w{5}/g" },
    { match: "adabr", start: 5, end: 9, regexp: "/\\w{5}/g" },
    { match: "magic", start: 15, end: 19, regexp: "/\\w{5}/g" },
    { match: "ical.", start: 18, end: 22, regexp: "/ical\\.$/g" },
  ]);
});
