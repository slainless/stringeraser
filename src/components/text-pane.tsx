import { onMount, useContext } from "solid-js";
import { StoreContext } from "./store";
import { PaneHeader } from "./pane-header";
import { TextPaneToolbar } from "./text-pane-toolbar";
import { $getRoot, createEditor } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { createEmptyHistoryState, registerHistory } from "@lexical/history";
import { registerPlainText } from "@lexical/plain-text";
import { TextPaneHighlighter } from "./text-pane-highligher";

export function TextPane() {
  const { store, setText, setLexicalState, setLexicalEditor } =
    useContext(StoreContext);

  const shouldBeLocked = () => Object.keys(store.selections).length > 0;

  let contentBox!: HTMLDivElement;

  onMount(() => {
    const editor = createEditor({
      namespace: "Editor",
      onError: console.error,
    });

    mergeRegister(
      registerHistory(editor, createEmptyHistoryState(), 300),
      registerPlainText(editor),
    );

    editor.registerUpdateListener(({ editorState }) => {
      setLexicalState(editorState.toJSON());
      editor.read(() => {
        const text = $getRoot().getTextContent();
        setText(text ?? "");
      });
    });

    editor.setRootElement(contentBox);
    setLexicalEditor(editor);
  });

  const hasText = () => store.text != null && store.text !== "";

  return (
    <div>
      <div class="sticky top-0 z-1">
        <PaneHeader
          title={shouldBeLocked() ? "Text (Locked)" : "Text"}
          class="position-initial mb-0"
        />
        <TextPaneToolbar />
      </div>
      <div class="p-5 relative overflow-x-auto">
        <div
          ref={contentBox}
          contentEditable={!shouldBeLocked()}
          class={
            "outline-none inline-block w-full overflow-x-auto whitespace-pre-wrap relative z-1"
          }
        />
        <span
          class="pointer-events-none absolute top-5 left-5 text-foreground/30"
          style={{
            display: hasText() ? "none" : "inline-block",
          }}
        >
          Insert target text to be matched against
        </span>
        <TextPaneHighlighter class="absolute top-5 z-0" />
      </div>
    </div>
  );
}
