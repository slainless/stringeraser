import { Matcher } from "@/core/matcher";
import {
  createMemo,
  createSignal,
  For,
  Index,
  type JSX,
  Match,
  Switch,
  useContext,
} from "solid-js";
import { StoreContext } from "./store";
import { safeRegex } from "safe-regex2";
import { MatchPaneItem } from "./match-pane-item";

export function MatchPane() {
  const { store } = useContext(StoreContext);
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

  const matches = createMemo(() => {
    setErrors();
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
    return matcher.findMatches(store.text);
  });

  return (
    <div class="p-5 h-[inherit] w-md overflow-y-auto border-r border-r-solid border-r-slate-2">
      <div class="flex flex-col gap-row-2">
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
