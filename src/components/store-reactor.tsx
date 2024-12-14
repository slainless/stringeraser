import type { ParentProps } from "solid-js";
import { createEffect, useContext } from "solid-js";
import { StoreContext } from "./store";
import { Matcher } from "@/core/matcher";
import {
  $getRoot,
  type SerializedParagraphNode,
  type SerializedTextNode,
} from "lexical";

export interface StoreReactorProps extends ParentProps {}
export function StoreReactor(props: StoreReactorProps) {
  const { store, clearSelections, setMatches } = useContext(StoreContext);

  const strings = () => store.lookup.strings.filter(isEmpty);
  const regexps = () => store.lookup.regexps.filter(isEmpty);
  const fullstrings = () => store.lookup.fullstrings.filter(isEmpty);

  createEffect(() => {
    clearSelections();

    if (
      (regexps().length < 1 && strings().length < 1) ||
      store.text == null ||
      store.text === ""
    )
      return setMatches([]);

    const matcher = new Matcher([...strings(), ...fullstrings()], regexps());
    const matches = matcher.findMatches(store.text).map((match, index) => {
      match.index = index;
      return match;
    });

    setMatches(matches);
  });

  createEffect(() => {
    if (store.lexicalEditor == null) return;
    const shouldUpdate = store.lexicalEditor.read(() => {
      const currentText = $getRoot().getTextContent();
      return currentText !== store.text;
    });
    if (!shouldUpdate) return;

    const state = store.lexicalEditor.getEditorState().toJSON();

    const nodes = buildLexicalNodes(store.text);
    state.root.children = [nodes];

    const editorState = store.lexicalEditor.parseEditorState(state);
    store.lexicalEditor.setEditorState(editorState);
  });

  return <>{props.children}</>;
}

const isEmpty = (string: string) => string != null && string !== "";

function buildLexicalNodes(text: string) {
  const nodes = text.split(/(\r\n|\n)/).flatMap((text) => {
    if (text === "\n" || text === "\r\n")
      return {
        type: "linebreak",
        version: 1,
      };

    return {
      detail: 0,
      format: 0,
      mode: "normal",
      style: "",
      text,
      type: "text",
      version: 1,
    } satisfies SerializedTextNode;
  });

  return {
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    textStyle: "",
    type: "paragraph",
    version: 1,
    children: nodes,
  } satisfies SerializedParagraphNode;
}
