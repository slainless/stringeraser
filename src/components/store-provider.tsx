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
    clearSelections() {
      setValue(
        produce((store) => {
          store.selections = {};
        }),
      );
    },
    select(match, select) {
      if (match.index == null) return;

      if (select) setValue("selections", match.index.toString(), match);
      else
        setValue(
          "selections",
          produce((selection) => {
            delete selection[match.index!.toString()];
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
