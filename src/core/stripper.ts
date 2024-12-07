import type { Matcher } from "./matcher";

export function strip(str: string, matches: Matcher.Match[]) {
  const simplified = simplify(matches);

  let result = "";
  let lastIndex = 0;

  for (const match of simplified) {
    result += str.slice(lastIndex, match.start);
    lastIndex = match.end + 1;
  }

  result += str.slice(lastIndex);

  return result;
}

function simplify(matches: Matcher.Match[]) {
  const sorted = [...matches].sort(
    (a, b) => a.start - b.start || a.end - b.end,
  );

  const merged: Matcher.Match[] = [];
  for (const match of sorted) {
    const { start, end } = match;
    if (merged.length === 0 || merged[merged.length - 1].end < start - 1)
      merged.push(match);
    else
      merged[merged.length - 1].end = Math.max(
        merged[merged.length - 1].end,
        end,
      );
  }

  return merged;
}
