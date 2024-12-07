import type { Matcher } from "@/core/matcher";
import { For, Index } from "solid-js";

export function OutputPane() {
  const matches: Matcher.Match[] = Array(20)
    .fill(0)
    .map(() => ({
      end: 0,
      match: "abra",
      start: 1,
      regexp: /ical\.$/g,
    }));

  return (
    <div class="p-5 h-[100vh] w-md overflow-y-auto border-r border-r-solid border-r-slate-2">
      <div class="flex flex-col gap-row-2">
        <Index each={matches}>
          {(item) => {
            return (
              <div>
                <div>
                  <span>abracadabra is magical.</span>
                </div>
                <div class="text-xs">
                  <span>Matched with: </span>
                  <span>{item().match}</span>
                </div>
              </div>
            );
          }}
        </Index>
      </div>
    </div>
  );
}
