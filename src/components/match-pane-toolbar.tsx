import { useContext } from "solid-js";
import { Button } from "./ui/button";
import { StoreContext } from "./store";
import { strip } from "@/core/stripper";

export function MatchPaneToolbar() {
  const { store, select, setText } = useContext(StoreContext);

  const selectionLength = () => Object.keys(store.selections).length;
  const shouldBeLocked = () => selectionLength() > 0;

  return (
    <div class="h-14 px-3 items-center bg-slate-2/50 backdrop-blur flex gap-2">
      <Button
        variant={"default"}
        onClick={() => {
          select(store.matches, selectionLength() < 1);
        }}
      >
        {selectionLength() > 0 ? "Unselect all" : "Select all"}
      </Button>
      <Button
        variant={"default"}
        onClick={() => {
          const unselected = store.matches.filter(
            (match) => match.index! in store.selections === false,
          );
          select(Object.values(store.selections), false);
          select(unselected, true);
        }}
      >
        Flip selection
      </Button>
      <Button
        variant={!shouldBeLocked() ? "default" : "destructive"}
        disabled={!shouldBeLocked()}
        onClick={() => {
          setText(strip(store.text, Object.values(store.selections)));
        }}
      >
        Delete Selected
      </Button>
    </div>
  );
}
