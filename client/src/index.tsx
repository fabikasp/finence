import React from "react";
import ReactDOM from "react-dom/client";

const rootElement = document.getElementById("root");

if (rootElement != null) {
    ReactDOM.createRoot(rootElement).render(<div>TEST</div>);
}
