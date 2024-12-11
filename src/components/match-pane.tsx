import type { Matcher } from "@/core/matcher";
import {
  createEffect,
  createSignal,
  Index,
  type JSX,
  Match,
  Show,
  Switch,
  useContext,
} from "solid-js";
import { StoreContext } from "./store";
import { safeRegex } from "safe-regex2";
import { MatchPaneItem } from "./match-pane-item";
import { PaneHeader } from "./pane-header";
import { MatchPaneToolbar } from "./match-pane-toolbar";

export function MatchPane() {
  const { store, select } = useContext(StoreContext);
  const [errors, setErrors] = createSignal<JSX.Element>();

  createEffect(() => {
    if (store.lookup.regexps.length < 1) return setErrors();

    const unsafe: string[] = [];
    for (const regexp of store.lookup.regexps)
      if (safeRegex(regexp) === false) unsafe.push(regexp);
    if (unsafe.length < 1) return setErrors();

    setErrors(
      <div class="text-red-6">
        <div>Some of the regexp patterns are unsafe:</div>
        <Index each={unsafe}>
          {(item) => (
            <div>
              <code>{item()}</code>
            </div>
          )}
        </Index>
      </div>,
    );
  });

  return (
    <div class="p-5 h-[inherit] overflow-y-auto w-md border-r border-r-solid border-r-slate-2">
      <div class="-mx-5 -mt-5 -top-5 sticky -top-5 mb-5">
        <PaneHeader title="Matches" class="position-initial mb-0" />
        <Show when={store.matches?.length > 0}>
          <MatchPaneToolbar />
        </Show>
      </div>
      <div class="flex flex-col gap-row-2">
        <Switch>
          <Match when={!isEmpty(errors())}>
            <div>{errors()}</div>
          </Match>
          <Match
            when={
              isEmpty(store.text) ||
              (isEmpty(store.lookup.regexps) && isEmpty(store.lookup.strings))
            }
          >
            <div class="text-foreground/30">
              Fill text & lookup pattern first
            </div>
          </Match>
          <Match when={store.matches.length < 1}>
            <div class="text-foreground/30">No matching pattern found</div>
          </Match>
          <Match when={store.matches.length > 0}>
            <Index each={store.matches}>
              {(item) => (
                <MatchPaneItem
                  match={item()}
                  isSelected={item().index?.toString()! in store.selections}
                  onCheck={select}
                  slice={slice(item(), store.text)}
                />
              )}
            </Index>
          </Match>
        </Switch>
      </div>
    </div>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const isEmpty = (v?: any | any[]) => v == null || v === "" || v?.length < 1;

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
