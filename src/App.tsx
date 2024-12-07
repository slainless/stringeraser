import "./App.css";
import "uno.css";
import "@unocss/reset/sanitize/sanitize.css";
import "@unocss/reset/sanitize/assets.css";
import { StoreProvider } from "./components/store-provider";
import { ToolbarPane } from "./components/toolbar-pane";
import { MatchPane } from "./components/match-pane";
import { TextPane } from "./components/text-pane";

function App() {
  return (
    <div class="grid grid-cols-[max-content_auto] min-h-[100vh]">
      <StoreProvider>
        <div class="sticky top-0 left-0 grid grid-cols-[max-content_max-content] h-[100vh] *:sticky">
          <ToolbarPane />
          <MatchPane />
        </div>
        <div class="overflow-x-auto">
          <TextPane />
        </div>
      </StoreProvider>
    </div>
  );
}

export default App;
