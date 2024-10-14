import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

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
        <Route path="problem/:id" Component={Problem} />You can provide a way better UX than this when your app throws errors by providing your own ErrorBoundary or errorElement prop on your route.
        <Route path="admin" Component={Admin} />
      </Route>
      <Route path="login" Component={Login} />
      <Route path="logout" Component={Logout} />
    </Route>,
  ),
);

export default router;
