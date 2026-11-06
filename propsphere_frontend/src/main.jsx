import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Homepage from "./components/Home/Home.jsx";
import Profile from "./components/dashboard/Profile.jsx";
import Properties from "./components/dashboard/Properties.jsx";
import Listings from "./components/dashboard/Listings.jsx";
import Favorites from "./components/dashboard/Favorites.jsx";
import Viewproperty from "./components/dashboard/Viewproperty.jsx";
import Bookings from "./components/dashboard/Bookings.jsx";
import Analytics from "./components/dashboard/Analytics.jsx";
import Requests from "./components/dashboard/Requests.jsx";
import Loginerror from "./components/auth/Loginerror.jsx";
import Registereror from "./components/auth/Registererror.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <Login></Login>,
      },
      {
        path: "/loginerror",
        element: <Loginerror></Loginerror>,
      },
      {
        path: "/home",
        element: <Homepage></Homepage>,
        children: [
          {
            path: "/home",
            element: <Properties></Properties>,
          },
          {
            path: "/home/profile",
            element: <Profile></Profile>,
          },
          {
            path: "/home/listings",
            element: <Listings></Listings>,
          },
          {
            path: "/home/favorites",
            element: <Favorites></Favorites>,
          },
          {
            path: "/home/viewprop",
            element: <Viewproperty></Viewproperty>,
          },
          {
            path: "/home/bookings",
            element: <Bookings></Bookings>,
          },
          {
            path: "/home/analytics",
            element: <Analytics></Analytics>,
          },
          {
            path: "/home/requests",
            element: <Requests></Requests>,
          },
        ],
      },
    ],
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/registererror",
    element: <Registereror></Registereror>,
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
