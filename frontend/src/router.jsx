import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import React from "react";

import Protected from "./layouts/Protected.jsx";

import Problem from "./pages/Problem.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Admin from "./pages/Admin.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route Component={Protected}>
        <Route index Component={Home} />
        <Route path="problem" Component={Problem} />
        <Route path="admin" Component={Admin} />
      </Route>
      <Route path="login" Component={Login} />
      <Route path="logout" Component={Logout} />
    </Route>,
  ),
);

export default router;