import { Matcher } from "@/core/matcher";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
  type JSX,
  Match,
  on,
  Switch,
  useContext,
} from "solid-js";
import { StoreContext } from "./store";
import { safeRegex } from "safe-regex2";
import { MatchPaneItem } from "./match-pane-item";
import { PaneHeader } from "./pane-header";

export function MatchPane() {
  const { store, clearSelections } = useContext(StoreContext);
  const [errors, setErrors] = createSignal<JSX.Element>();

  const filteredPatterns = createMemo(() => {
    return store.lookup.strings.filter(
      (string) => string != null && string !== "",
    );
  });

  const filteredRegexps = createMemo(() => {
    return store.lookup.regexps.filter(
      (regexp) => regexp != null && regexp !== "",
    );
  });

  createEffect(
    on([filteredPatterns, filteredRegexps, () => store.text], () => {
      clearSelections();
      setErrors();
    }),
  );

  const matches = createMemo(() => {
    const unsafe: string[] = [];
    for (const regexp of filteredRegexps())
      if (safeRegex(regexp) === false) unsafe.push(regexp);

    if (unsafe.length > 0) {
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
      return [];
    }

    const matcher = new Matcher(filteredPatterns(), filteredRegexps());
    return matcher.findMatches(store.text).map((match, index) => {
      match.index = index;
      return match;
    });
  });

  return (
    <div class="p-5 h-[inherit] w-md border-r border-r-solid border-r-slate-2">
      <PaneHeader title="Matches" class="-mx-5 -mt-5 -top-5" />
      <div class="flex flex-col gap-row-2 overflow-y-auto">
        <Switch>
          <Match when={!isEmpty(errors())}>
            <div>{errors()}</div>
          </Match>
          <Match
            when={
              isEmpty(store.text) ||
              (isEmpty(filteredPatterns()) && isEmpty(filteredRegexps()))
            }
          >
            <div class="text-foreground/30">
              Fill text & lookup pattern first
            </div>
          </Match>
          <Match when={matches().length < 1}>
            <div class="text-foreground/30">No matching pattern found</div>
          </Match>
          <Match when={matches()}>
            <For each={matches()}>
              {(item) => <MatchPaneItem item={item} text={store.text} />}
            </For>
          </Match>
        </Switch>
      </div>
    </div>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const isEmpty = (v?: any | any[]) => v == null || v === "" || v?.length < 1;
