import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Playground from "../client/pages/code";
import "./App.css";

function App() {
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/problem" element={<Playground />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
