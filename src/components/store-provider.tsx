import { createStore, produce, reconcile } from "solid-js/store";
import { DEFAULT_STORE, StoreContext, type Store } from "./store";
import { untrack, type ParentProps } from "solid-js";
import { Mutex } from "async-mutex";

export function StoreProvider(props: ParentProps) {
  const [value, setValue] = createStore<Store>(DEFAULT_STORE());
  const fileMutex = untrack(() => new Mutex());

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
    setFile(fileHandle) {
      return fileMutex.runExclusive(async () => {
        const file = await fileHandle.getFile();
        const text = await file.text();
        setValue("text", text);
        setValue("file", { handle: fileHandle, file, text });
      });
    },
    saveChangesToFile() {
      return fileMutex.runExclusive(async () => {
        const text = value.text;
        const handle = value.file?.handle;

        if (handle == null) return;

        const writer = await handle.createWritable({
          keepExistingData: false,
        });

        await writer.write(text);
        await writer.close();
        setValue("file", "text", text);
      });
    },
    closeFile() {
      return fileMutex.runExclusive(async () => {
        const file = value.file?.file;
        if (file == null) return;

        setValue(
          produce((store) => {
            store.file = undefined;
          }),
        );
      });
    },
    setLexicalState(state) {
      setValue("lexicalState", reconcile(state));
    },
    setLexicalEditor(editor) {
      setValue(
        produce((store) => {
          store.lexicalEditor = editor;
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
