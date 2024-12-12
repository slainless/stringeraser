import type { ParentProps } from "solid-js";
import { createEffect, useContext } from "solid-js";
import { StoreContext } from "./store";
import { on } from "solid-js";
import { Matcher } from "@/core/matcher";
import { $getRoot, $insertNodes } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";

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

  createEffect(
    on([() => store.lexicalEditor, () => store.text], async () => {
      if (store.lexicalEditor == null) return;

      const shouldUpdate = store.lexicalEditor.read(() => {
        const currentText = $getRoot().getTextContent();
        return currentText !== store.text;
      });
      if (!shouldUpdate) return;

      store.lexicalEditor!.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(
          `<p>${format(store.text)}</p>`,
          "text/html",
        );

        const nodes = $generateNodesFromDOM(store.lexicalEditor!, dom);
        $getRoot().clear();
        $insertNodes(nodes);
      });
    }),
  );

  return <>{props.children}</>;
}

function escapeHTML(str: string) {
  const div = document.createElement("div");
  div.innerText = str;
  return div.innerHTML;
}

function format(text: string) {
  return escapeHTML(text).replaceAll(/(\r\n|\n)/g, "</br>");
}

const isEmpty = (string: string) => string != null && string !== "";
