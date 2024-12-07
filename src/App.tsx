import "./App.css";
import "uno.css";
import "@unocss/reset/sanitize/sanitize.css";
import "@unocss/reset/sanitize/assets.css";
import { StoreProvider } from "./components/store-provider";
import { ToolbarPane } from "./components/toolbar-pane";
import { MatchPane } from "./components/match-pane";
import { TextPane } from "./components/text-pane";
import { PaneHeader } from "./components/pane-header";

function App() {
  return (
    <div class="grid grid-cols-[max-content_auto] min-h-[100vh]">
      <StoreProvider>
        <div class="sticky top-0 left-0 grid grid-cols-[max-content_max-content] h-[100vh] *:sticky">
          <ToolbarPane />
          <MatchPane />
        </div>
        <div class="min-h-[100vh] bg-slate-1">
          <PaneHeader title="Text" class="mb-0" />
          <div class="overflow-x-auto">
            <TextPane />
          </div>
        </div>
      </StoreProvider>
    </div>
  );
}

export default App;
