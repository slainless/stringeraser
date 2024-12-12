import { createEffect, useContext } from "solid-js";
import { StoreContext } from "./store";
import type { Matcher } from "@/core/matcher";
import { cn } from "@/libs/cn";

export interface TextPaneHighlighterProps {
  box?: HTMLDivElement;
  class?: string;
}

export function TextPaneHighlighter(props: TextPaneHighlighterProps) {
  const { store } = useContext(StoreContext);

  let highlighter!: HTMLDivElement;

  createEffect(async () => {
    if (store.matches.length < 1) {
      highlighter.textContent = "";
      return;
    }

    const sequences = tagSequences(store.matches, store.selections);

    let build = "";
    let lastIndex = 0;
    for (const seq of sequences) {
      build += escapeHTML(store.text.slice(lastIndex, seq.index)) + seq.tag;
      lastIndex = seq.index;
    }

    build += store.text.slice(lastIndex);
    build = build.replaceAll(/\r\n|\n/g, "<br/>");

    highlighter.innerHTML = build ?? "";
  });

  return (
    <div
      class={cn(
        "text-transparent pointer-events-none whitespace-pre-wrap",
        props.class,
      )}
      ref={highlighter}
    >
      {}
    </div>
  );
}

function escapeHTML(str: string) {
  const div = document.createElement("div");
  div.innerText = str;
  return div.innerHTML;
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
