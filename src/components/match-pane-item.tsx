import type { Matcher } from "@/core/matcher";
import { Checkbox, CheckboxControl } from "./ui/checkbox";

export interface MatchPaneItemProps {
  item: Matcher.Match;
  text: string;
}

export function MatchPaneItem(props: MatchPaneItemProps) {
  const { start, end } = props.item;

  let lower: number;
  let upper: number;
  let lowerPads = 0;
  let upperPads = 0;

  const viewLength = 40;
  const matchLength = end - start;
  if (matchLength >= viewLength) {
    lower = start;
    upper = Math.min(start + viewLength, end);
  } else {
    const pads = viewLength - matchLength;
    lowerPads = Math.floor((pads * 30) / 100);
    upperPads = pads - lowerPads;

    lower = start;
    upper = end;
  }

  const sliced =
    props.text.slice(lower, upper + 1) +
    (matchLength >= viewLength ? "..." : "");
  const lowerPadSliced = props.text.slice(lower - lowerPads, lower);
  const upperPadSliced = props.text.slice(upper + 1, upper + upperPads + 1);
  const prefix = lower > 0 && matchLength < viewLength ? "..." : "";
  const suffix =
    upper < props.text.length - 1 && matchLength < viewLength ? "..." : "";

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
            <span>{prefix}</span>
            <span>{lowerPadSliced}</span>
            <span class="bg-blue-2">{sliced}</span>
            <span>{upperPadSliced}</span>
            <span>{suffix}</span>
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
