import type { ParentProps } from "solid-js";
import { createEffect, useContext } from "solid-js";
import { StoreContext } from "./store";
import { on } from "solid-js";
import { Matcher } from "@/core/matcher";
import {
  $getRoot,
  LineBreakNode,
  ParagraphNode,
  TextNode,
  type LexicalEditor,
  type SerializedLexicalNode,
} from "lexical";
import { produce } from "immer";
import { unwrap } from "solid-js/store";

export interface StoreReactorProps extends ParentProps {}
export function StoreReactor(props: StoreReactorProps) {
  const { store, clearSelections, setMatches } = useContext(StoreContext);

  createEffect(() => {
    clearSelections();

    if (
      (store.lookup.strings.length < 1 && store.lookup.regexps.length < 1) ||
      store.text == null ||
      store.text === ""
    )
      return setMatches([]);

    const matcher = new Matcher(store.lookup.strings, store.lookup.regexps);
    const matches = matcher.findMatches(store.text).map((match, index) => {
      match.index = index;
      return match;
    });

    setMatches(matches);
  });

  createEffect(
    on([() => store.lexicalEditor, () => store.text], async () => {
      if (store.lexicalEditor == null) return;

      const shouldUpdate = store.lexicalEditor.read(() => {
        const currentText = $getRoot().getTextContent();
        return currentText !== store.text;
      });
      if (!shouldUpdate) return;

      const nodes = await parse(store.text, store.lexicalEditor);
      const state = produce(unwrap(store.lexicalState!), (state) => {
        state.root.children = nodes;
      });
      store.lexicalEditor.setEditorState(
        store.lexicalEditor.parseEditorState(state),
      );
    }),
  );

  return <>{props.children}</>;
}

function parse(
  text: string,
  editor: LexicalEditor,
): Promise<SerializedLexicalNode[]> {
  return new Promise((res) => {
    editor.update(() => {
      if (text === "") {
        return res([new ParagraphNode().exportJSON()]);
      }

      const nodes = text
        .split("\n")
        .flatMap((text) => {
          return [new TextNode(text), new LineBreakNode()];
        })
        .filter((node, index, array) => {
          if (node instanceof TextNode && node.__text === "") return false;
          if (index === array.length - 1 && node instanceof LineBreakNode)
            return false;
          return true;
        })
        .map((node) => node.exportJSON());

      return res([
        {
          ...new ParagraphNode().exportJSON(),
          // @ts-expect-error
          children: nodes,
        },
      ]);
    });
  });
}
