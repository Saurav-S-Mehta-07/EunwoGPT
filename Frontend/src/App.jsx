import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import EunwoGPT from "./EunwoGPT";
import NotFound from "./NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EunwoGPT />} />
        <Route path="/EunwoGPT" element={<EunwoGPT />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
