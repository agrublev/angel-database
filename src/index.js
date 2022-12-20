import { createRoot } from "react-dom/client";
import { Provider } from "mobx-react";
import App from "./App";
import { rootStore } from "./stores/RootStore";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
	<Provider store={rootStore}>
		<App />
	</Provider>
);
