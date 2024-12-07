import { createMemo, useContext } from "solid-js";
import { TextArea } from "./ui/textarea";
import { TextFieldLabel, TextFieldRoot } from "./ui/textfield";
import { StoreContext } from "./store";

export function ToolbarPane() {
  const { store, setPatterns } = useContext(StoreContext);

  const strings = createMemo(() => store.lookup.strings);
  const regexps = createMemo(() => store.lookup.regexps);

  const shouldBeLocked = () => Object.keys(store.selections).length > 0;

  return (
    <div class="p-5 min-h-[inherit] border-r-slate-2 border-r border-r-solid">
      <TextFieldRoot class="mb-5">
        <TextFieldLabel>Normal string patterns</TextFieldLabel>
        <TextArea
          autoResize
          placeholder="Separated by newline"
          class="w-72 mb-2 max-h-48 overflow-auto"
          value={strings().join("\n")}
          readOnly={shouldBeLocked()}
          onchange={(event) => {
            setPatterns(event.target.value.split("\n"), store.lookup.regexps);
          }}
        />
      </TextFieldRoot>
      <TextFieldRoot>
        <TextFieldLabel>Regexp string patterns</TextFieldLabel>
        <TextArea
          autoResize
          placeholder="Separated by newline"
          class="w-72 max-h-48 overflow-auto"
          value={regexps().join("\n")}
          readOnly={shouldBeLocked()}
          onchange={(event) => {
            setPatterns(store.lookup.strings, event.target.value.split("\n"));
          }}
        />
      </TextFieldRoot>
    </div>
  );
}
