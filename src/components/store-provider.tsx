import { createStore } from "solid-js/store";
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
  };

  return (
    <StoreContext.Provider value={context}>
      {props.children}
    </StoreContext.Provider>
  );
}
