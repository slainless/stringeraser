import { createStore, produce } from "solid-js/store";
import { DEFAULT_STORE, StoreContext, type Store } from "./store";
import type { ParentProps } from "solid-js";

export function StoreProvider(props: ParentProps) {
  const [value, setValue] = createStore<Store>(DEFAULT_STORE());

  const context: StoreContext = {
    store: value,
    setText(string) {
      setValue("text", string);
    },
    setPatterns(strings, regexps) {
      setValue("lookup", { strings, regexps });
    },
    setMatches(matches) {
      setValue(
        produce((store) => {
          store.matches = matches;
        }),
      );
    },
    clearSelections() {
      setValue(
        produce((store) => {
          store.selections = {};
        }),
      );
    },
    select(matches, select) {
      setValue(
        "selections",
        produce((selection) => {
          for (const match of Array.isArray(matches) ? matches : [matches]) {
            if (match.index == null) continue;

            const index = match.index!.toString();
            if (select) selection[index] = match;
            else delete selection[index];
          }
        }),
      );
    },
  };

  return (
    <StoreContext.Provider value={context}>
      {props.children}
    </StoreContext.Provider>
  );
}
