import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Playground from "./pages/code";
import Home from "./pages/Home.jsx";
import React from "react";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problem" element={<Playground />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
