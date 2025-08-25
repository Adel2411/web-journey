import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ReactQueryProvider from "./providers/react-query-provider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ReactQueryProvider>
			<App />
		</ReactQueryProvider>
	</StrictMode>
);
