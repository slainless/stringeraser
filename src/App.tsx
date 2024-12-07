import "./App.css";
import "uno.css";
import "@unocss/reset/sanitize/sanitize.css";
import "@unocss/reset/sanitize/assets.css";
import { StoreProvider } from "./components/store-provider";
import { ToolbarPane } from "./components/toolbar-pane";
import { MatchPane } from "./components/match-pane";

function App() {
  return (
    <div class="min-h-[100vh]">
      <StoreProvider>
        <div class="fixed grid grid-cols-[max-content_max-content] h-[100vh]">
          <ToolbarPane />
          <MatchPane />
        </div>
      </StoreProvider>
    </div>
  );
}

export default App;
