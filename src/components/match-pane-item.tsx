import type { Matcher } from "@/core/matcher";
import { Checkbox, CheckboxControl, CheckboxLabel } from "./ui/checkbox";
import { cn } from "@/libs/cn";

export interface MatchPaneItemProps {
  onCheck: (item: Matcher.Match, check: boolean) => void;
  isSelected: boolean;
  slice: TextSlice;
  match: Matcher.Match;
}

export interface TextSlice {
  prefix: string;
  lowerPad: string;
  match: string;
  upperPad: string;
  suffix: string;
}

export function MatchPaneItem(props: MatchPaneItemProps) {
  const slice = () => props.slice;
  const match = () => props.match;

  return (
    <Checkbox
      checked={props.isSelected}
      onChange={(check) => props.onCheck(match(), check)}
      class="flex items-center space-x-2 w-full"
    >
      <CheckboxControl />
      <CheckboxLabel class="flex-grow-1">
        <div>
          <div>
            <span>
              <span>{slice().prefix}</span>
              <span>{slice().lowerPad}</span>
              <span class={cn(props.isSelected ? "bg-red-2" : "bg-blue-2")}>
                {slice().match}
              </span>
              <span>{slice().upperPad}</span>
              <span>{slice().suffix}</span>
            </span>
          </div>
          <div class="text-xs">
            <span>Matched with: </span>
            <span>
              <code>{match().regexp?.toString() ?? match().match}</code>
            </span>
          </div>
        </div>
      </CheckboxLabel>
    </Checkbox>
  );
}
