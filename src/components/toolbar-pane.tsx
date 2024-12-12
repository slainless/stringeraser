import { createMemo, For, Index, useContext } from "solid-js";
import { TextArea } from "./ui/textarea";
import { textfieldLabel, TextFieldLabel, TextFieldRoot } from "./ui/textfield";
import { StoreContext } from "./store";
import { PaneHeader } from "./pane-header";
import { Button } from "./ui/button";
import Plus from "lucide-solid/icons/plus";
import Minus from "lucide-solid/icons/minus";
import { cn } from "@/libs/cn";

export function ToolbarPane() {
  const { store, setPatterns } = useContext(StoreContext);

  const strings = createMemo(() => store.lookup.strings);
  const regexps = createMemo(() => store.lookup.regexps);

  const shouldBeLocked = () => Object.keys(store.selections).length > 0;

  return (
    <div class="p-5 min-h-[inherit] border-r-slate-2 border-r border-r-solid">
      <PaneHeader
        title={shouldBeLocked() ? "Patterns (Locked)" : "Patterns"}
        class="-mx-5 -mt-5"
      />
      <TextFieldRoot class="mb-5">
        <TextFieldLabel>Normal string patterns</TextFieldLabel>
        <TextArea
          autoResize
          placeholder="Separated by newline"
          class="w-72 mb-2 max-h-48 overflow-auto font-mono"
          value={strings().join("\n")}
          readOnly={shouldBeLocked()}
          onChange={(event) => {
            setPatterns(
              event.target.value.split("\n"),
              store.lookup.regexps,
              store.lookup.fullstrings,
            );
          }}
        />
      </TextFieldRoot>
      <TextFieldRoot class="mb-5">
        <TextFieldLabel>Regexp string patterns</TextFieldLabel>
        <TextArea
          autoResize
          placeholder="Separated by newline"
          class="w-72 max-h-48 overflow-auto font-mono"
          value={regexps().join("\n")}
          readOnly={shouldBeLocked()}
          onChange={(event) => {
            setPatterns(
              store.lookup.strings,
              event.target.value.split("\n"),
              store.lookup.fullstrings,
            );
          }}
        />
      </TextFieldRoot>
      <div class="w-72">
        <div class={cn(textfieldLabel(), "mb-1")}>
          String patterns with newline
        </div>
        <For each={store.lookup.fullstrings}>
          {(item, index) => {
            return (
              <div class="flex gap-2 mb-2">
                <Button
                  class="w-8 h-8 p-0"
                  disabled={shouldBeLocked()}
                  onClick={() => {
                    const result = [...store.lookup.fullstrings];
                    result.splice(index(), 1);
                    setPatterns(
                      store.lookup.strings,
                      store.lookup.regexps,
                      result,
                    );
                  }}
                >
                  <Minus size={12} />
                </Button>
                <TextFieldRoot class="flex-grow-1">
                  <TextArea
                    autoResize
                    placeholder="Newline sensitive"
                    class="font-mono"
                    value={item}
                    readOnly={shouldBeLocked()}
                    onChange={(event) => {
                      const result = [...store.lookup.fullstrings];
                      result.splice(index(), 1, event.target.value);
                      setPatterns(
                        store.lookup.strings,
                        store.lookup.regexps,
                        result,
                      );
                    }}
                  />
                </TextFieldRoot>
              </div>
            );
          }}
        </For>
        <div>
          <Button
            class="w-8 h-8 p-0"
            disabled={shouldBeLocked()}
            onClick={() =>
              setPatterns(store.lookup.strings, store.lookup.regexps, [
                ...store.lookup.fullstrings,
                "",
              ])
            }
          >
            <Plus size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
