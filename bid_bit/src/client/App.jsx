import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Playground from "./pages/code";
import Home from "./pages/Home.jsx";
import React from "react";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Admin from "./pages/admin.tsx";
import Protected from "./layouts/Protected.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route Component={Protected}>
        <Route index Component={Home} />
        <Route path="problem" Component={Playground} />
        <Route path="admin" Component={Admin} />
      </Route>
      <Route path="login" Component={Login} />
      <Route path="logout" Component={Logout} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
