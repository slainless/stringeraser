import { createContext } from "solid-js";

export interface Store {
  text: string;

  lookup: {
    strings: string[];
    regexps: string[];
  };
}

export const DEFAULT_STORE = (): Store => ({
  text: "",
  lookup: {
    strings: [],
    regexps: [],
  },
});

export interface StoreContext {
  store: Store;
  setText(string: string): void;
  setPatterns(strings: string[], regexps: string[]): void;
}

export const StoreContext = createContext<StoreContext>({
  store: DEFAULT_STORE(),
  setText: () => void 0,
  setPatterns: () => void 0,
});
