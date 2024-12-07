import type { Matcher } from "@/core/matcher";
import { For, Index } from "solid-js";
import { Checkbox, CheckboxControl } from "./ui/checkbox";
import { StoreContext } from "./store";
import { safeRegex } from "safe-regex2";

export function MatchPane() {
  const { store } = useContext(StoreContext);
  const [errors, setErrors] = createSignal<JSX.Element>();

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

    const matcher = new Matcher(store.lookup.strings, filteredRegexps());
    return matcher.findMatches(store.text);
  });

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
