import type { Matcher } from "@/core/matcher";
import { Checkbox, CheckboxControl } from "./ui/checkbox";

export interface MatchPaneItemProps {
  item: Matcher.Match;
  text: string;
}

export function MatchPaneItem(props: MatchPaneItemProps) {
  const slices = slice(props.item, props.text);
  return (
    <div class="grid grid-cols-[max-content_auto] gap-col-2 w-full">
      <div class="flex items-center justify-center">
        <Checkbox>
          <CheckboxControl />
        </Checkbox>
      </div>
      <div>
        <div>
          <span>
            <span>{slices.prefix}</span>
            <span>{slices.lowerPad}</span>
            <span class="bg-blue-2">{slices.match}</span>
            <span>{slices.upperPad}</span>
            <span>{slices.suffix}</span>
          </span>
        </div>
        <div class="text-xs">
          <span>Matched with: </span>
          <span>{props.item.match}</span>
        </div>
      </div>
    </div>
  );
}

function slice(item: Matcher.Match, text: string) {
  const bounds = calculateSliceBound(item, 40);

  let match = text.slice(bounds.lower, bounds.upper + 1);
  if (bounds.isOverflow) match += "...";

  const lowerPad = text.slice(bounds.lower - bounds.lowerPads, bounds.lower);
  const upperPad = text.slice(
    bounds.upper + 1,
    bounds.upper + bounds.upperPads + 1,
  );
  const prefix = bounds.lower > 0 && !bounds.isOverflow ? "..." : "";
  const suffix =
    bounds.upper < text.length - 1 && !bounds.isOverflow ? "..." : "";

  return {
    match,
    lowerPad,
    upperPad,
    prefix,
    suffix,
  };
}

function calculateSliceBound(
  match: Matcher.Match,
  viewLength: number,
  lowerPadPercentage = 30,
) {
  const matchLength = match.end - match.start;
  if (matchLength >= viewLength)
    return {
      lowerPads: 0,
      upperPads: 0,
      lower: match.start,
      upper: Math.min(match.start + viewLength, match.end),
      isOverflow: true,
    };

  const pads = viewLength - matchLength;
  const lowerPads = Math.floor((pads * lowerPadPercentage) / 100);
  return {
    lowerPads,
    upperPads: pads - lowerPads,

    lower: match.start,
    upper: match.end,
    isOverflow: false,
  };
}
