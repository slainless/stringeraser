import { createSignal, Match, Show, Switch, useContext } from "solid-js";
import { Button } from "./ui/button";
import { StoreContext } from "./store";

export function TextPaneToolbar() {
  const [isUploadLocked, setIsUploadLocked] = createSignal(false);
  const { store, setFile, saveChangesToFile } = useContext(StoreContext);
  const file = () => store.file;
  const isChanged = () => store.file?.text !== store.text;

  return (
    <div class="h-14 px-3 items-center bg-slate-2/50 flex backdrop-blur gap-2">
      <Button
        disabled={isUploadLocked()}
        onClick={async (e) => {
          try {
            setIsUploadLocked(true);
            const [fileHandle] = await window.showOpenFilePicker({
              multiple: false,
              types: [
                {
                  description: "Text file",
                  accept: { "text/plain": ".txt" },
                },
              ],
            });
            setFile(fileHandle);
          } finally {
            setIsUploadLocked(false);
          }
        }}
      >
        <Switch>
          <Match when={file() != null}>Change file</Match>
          <Match when={true}>Upload text</Match>
        </Switch>
      </Button>
      <Show when={file() != null}>
        <Button
          variant="destructive"
          disabled={!isChanged()}
          class="mr-3 bg-blue-5 hover:bg-blue-5/90"
          onClick={(e) => {
            saveChangesToFile();
          }}
        >
          Save changes
        </Button>
      </Show>
      <Show when={file() != null}>
        <div>
          <div class="text-sm">Editing on file:</div>
          <div class="text-xs">{file()?.file.name}</div>
        </div>
      </Show>
    </div>
  );
}
