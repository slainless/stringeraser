import { createEffect, createMemo, useContext } from "solid-js";
import { StoreContext } from "./store";
import { PaneHeader } from "./pane-header";
import type { Matcher } from "@/core/matcher";
import { TextPaneToolbar } from "./text-pane-toolbar";

export function TextPane() {
  const { store, setText } = useContext(StoreContext);
  const text = () => store.text;
  const matches = () => store.matches;
  const selections = () => store.selections;

  let contentBox!: HTMLSpanElement;

  const shouldBeLocked = () => Object.keys(store.selections).length > 0;

  createEffect(() => {
    if (contentBox == null) return;
    if (contentBox.textContent === text()) return;
    contentBox.textContent = text();
  });

  createEffect(() => {
    if (matches().length < 1) {
      contentBox.textContent = text();
      return;
    }

    const sequences = tagSequences(matches(), selections());

    let build = "";
    let lastIndex = 0;
    for (const seq of sequences) {
      build += text().slice(lastIndex, seq.index) + seq.tag;
      lastIndex = seq.index;
    }

    build += text().slice(lastIndex);

    contentBox.innerHTML = build;
  });

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
        <span
          ref={contentBox}
          contentEditable={!shouldBeLocked()}
          class={
            "outline-none inline-block w-full overflow-x-auto whitespace-pre-wrap"
          }
          onpaste={(event) => {
            event.preventDefault();

            const clipboardData = event.clipboardData;
            const plainText = clipboardData?.getData("text/plain");

            const selection = window.getSelection();
            if (!selection?.rangeCount) return;

            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(plainText ?? ""));

            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
            setText(event.target.textContent!);
          }}
          oninput={(event) => {
            setText(event.target.textContent!);
          }}
        />
        <span
          class="pointer-events-none absolute top-5 left-5 text-foreground/30"
          style={{
            display: text() == null || text() === "" ? "inline-block" : "none",
          }}
        >
          Insert target text to be matched against
        </span>
      </div>
    </div>
  );
}

function tagSequences(
  matches: Matcher.Match[],
  selections: Record<string, Matcher.Match>,
) {
  const ordered = [...matches].sort((a, b) => a.start - b.start);

  const sequences: { index: number; tag: string }[] = [];
  for (const match of ordered) {
    sequences.push({
      index: match.start,
      tag: `<span class="${match.index! in selections ? "bg-red-2" : "bg-blue-2"}">`,
    });
    sequences.push({
      index: match.end + 1,
      tag: "</span>",
    });
  }

  return sequences.sort((a, b) => a.index - b.index);
}
