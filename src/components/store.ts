import type { Matcher } from "@/core/matcher";
import type {
  LexicalEditor,
  SerializedEditorState,
  SerializedLineBreakNode,
  SerializedParagraphNode,
  SerializedTabNode,
  SerializedTextNode,
} from "lexical";
import { createContext } from "solid-js";

export interface Store {
  text: string;

  lookup: {
    strings: string[];
    regexps: string[];
    fullstrings: string[];
  };

  selections: Record<string, Matcher.Match>;
  matches: Matcher.Match[];
  file?: {
    handle: FileSystemFileHandle;
    file: File;
    text: string;
  };

  lexicalEditor?: LexicalEditor;
  lexicalState?: SerializedEditorState<
    | SerializedTextNode
    | SerializedParagraphNode
    | SerializedLineBreakNode
    | SerializedTabNode
  >;
}

export const DEFAULT_STORE = (): Store => ({
  text: "",
  lookup: {
    strings: [],
    regexps: [],
    fullstrings: [],
  },
  selections: {},
  matches: [],
  lexicalState: undefined,
  lexicalEditor: undefined,
});

export interface StoreContext {
  store: Store;
  setText(string: string): void;
  setPatterns(
    strings: string[],
    regexps: string[],
    fullstrings: string[],
  ): void;
  setMatches(matches: Matcher.Match[]): void;
  clearSelections(): void;
  select(match: Matcher.Match | Matcher.Match[], select: boolean): void;
  setFile(fileHandle: FileSystemFileHandle): Promise<void>;
  saveChangesToFile(): Promise<void>;
  closeFile(): Promise<void>;
  setLexicalState(state: SerializedEditorState): void;
  setLexicalEditor(editor: LexicalEditor): void;
}

export const StoreContext = createContext<StoreContext>({
  store: DEFAULT_STORE(),
  setText: () => void 0,
  setPatterns: () => void 0,
  setMatches: () => void 0,
  clearSelections: () => void 0,
  select: () => void 0,
  setFile: () => Promise.resolve(),
  saveChangesToFile: () => Promise.resolve(),
  closeFile: () => Promise.resolve(),
  setLexicalState: () => void 0,
  setLexicalEditor: () => void 0,
});
