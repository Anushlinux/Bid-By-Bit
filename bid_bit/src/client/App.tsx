import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Playground from "./pages/code";
import "./App.css";
import Admin from "./pages/admin";

function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/problem" element={<Playground />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
