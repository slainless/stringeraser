import "./App.css";
import "uno.css";
import "@unocss/reset/sanitize/sanitize.css";
import "@unocss/reset/sanitize/assets.css";
import { StoreProvider } from "./components/store-provider";
import { ToolbarPane } from "./components/toolbar-pane";
import { OutputPane } from "./components/output-pane";

function App() {
  return (
    <div class="min-h-[100vh]">
      <StoreProvider>
        <div class="sticky grid grid-cols-[max-content_max-content] min-h-[inherit]">
          <ToolbarPane />
          <OutputPane />
        </div>
      </StoreProvider>
    </div>
  );
}

export default App;
