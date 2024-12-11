import type { ParentProps } from "solid-js";
import { createEffect, createMemo, useContext } from "solid-js";
import { StoreContext } from "./store";
import { on } from "solid-js";
import { Matcher } from "@/core/matcher";

export interface StoreReactorProps extends ParentProps {}
export function StoreReactor(props: StoreReactorProps) {
  const { store, clearSelections, setMatches } = useContext(StoreContext);

  createEffect(() => {
    clearSelections();

    if (
      (store.lookup.strings.length < 1 && store.lookup.regexps.length < 1) ||
      store.text == null ||
      store.text === ""
    )
      return setMatches([]);

    const matcher = new Matcher(store.lookup.strings, store.lookup.regexps);
    const matches = matcher.findMatches(store.text).map((match, index) => {
      match.index = index;
      return match;
    });

    setMatches(matches);
  });

  return <>{props.children}</>;
}
