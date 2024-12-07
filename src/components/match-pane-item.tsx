import type { Matcher } from "@/core/matcher";
import { Checkbox, CheckboxControl, CheckboxLabel } from "./ui/checkbox";
import { useContext } from "solid-js";
import { StoreContext } from "./store";
import { cn } from "@/libs/cn";

export interface MatchPaneItemProps {
  item: Matcher.Match;
  text: string;
}

export function MatchPaneItem(props: MatchPaneItemProps) {
  const { store, select } = useContext(StoreContext);
  const slices = slice(props.item, props.text);

  const isSelected = () => props.item.index?.toString()! in store.selections;

  return (
    <Checkbox
      checked={isSelected()}
      onChange={(checked) => {
        select(props.item, checked);
      }}
      class="flex items-center space-x-2 w-full"
    >
      <CheckboxControl />
      <CheckboxLabel class="flex-grow-1">
        <div>
          <div>
            <span>
              <span>{slices.prefix}</span>
              <span>{slices.lowerPad}</span>
              <span class={cn(isSelected() ? "bg-red-2" : "bg-blue-2")}>
                {slices.match}
              </span>
              <span>{slices.upperPad}</span>
              <span>{slices.suffix}</span>
            </span>
          </div>
          <div class="text-xs">
            <span>Matched with: </span>
            <span>{props.item.match}</span>
          </div>
        </div>
      </CheckboxLabel>
    </Checkbox>
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
