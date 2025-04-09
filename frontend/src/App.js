import logo from "./logo.svg";
import "./App.css";
import LandingPage from "./component/LandingPage";

import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy } from "react";
const GamePage = lazy(()=>import('./component/gameBoard/gameBoard'));

const router = createBrowserRouter([
  { path: "/:roomId?", Component: LandingPage },
  { path: "/gamepage",Component: GamePage },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
