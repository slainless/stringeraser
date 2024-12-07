import type { Matcher } from "@/core/matcher";
import { For, Index } from "solid-js";
import { Checkbox, CheckboxControl } from "./ui/checkbox";

export function MatchPane() {
  const matches: Matcher.Match[] = Array(20)
    .fill(0)
    .map(() => ({
      end: 0,
      match: "abra",
      start: 1,
      regexp: /ical\.$/g,
    }));

  return (
    <div class="p-5 h-[inherit] w-md overflow-y-auto border-r border-r-solid border-r-slate-2">
      <div class="flex flex-col gap-row-2">
        <Index each={matches}>
          {(item) => {
            return (
              <div class="grid grid-cols-[max-content_auto] gap-col-2 w-full">
                <div class="flex items-center justify-center">
                  <Checkbox>
                    <CheckboxControl />
                  </Checkbox>
                </div>
                <div>
                  <div>
                    <span>abracadabra is magical.</span>
                  </div>
                  <div class="text-xs">
                    <span>Matched with: </span>
                    <span>{item().match}</span>
                  </div>
                </div>
              </div>
            );
          }}
        </Index>
      </div>
    </div>
  );
}
