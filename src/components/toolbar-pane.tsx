import { TextArea } from "./ui/textarea";
import { TextFieldLabel, TextFieldRoot } from "./ui/textfield";

export function ToolbarPane() {
  return (
    <div class="p-5 min-h-[inherit] border-r-slate-2 border-r border-r-solid">
      <TextFieldRoot class="mb-5">
        <TextFieldLabel>Normal string patterns</TextFieldLabel>
        <TextArea
          autoResize
          placeholder="Separated by newline"
          class="w-72 mb-2 max-h-48 overflow-auto"
        />
      </TextFieldRoot>
      <TextFieldRoot>
        <TextFieldLabel>Regexp string patterns</TextFieldLabel>
        <TextArea
          autoResize
          placeholder="Separated by newline"
          class="w-72 max-h-48 overflow-auto"
        />
      </TextFieldRoot>
    </div>
  );
}
