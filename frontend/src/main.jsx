import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import Register from './components/auth/Register.jsx'
import Property from './components/properties/Property.jsx'
import User from './components/users/User.jsx'
import AddProperty from './components/users/AddProperty.jsx'
import Profile from './components/profile/Profile.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            }
        ]
    },
    {
        path: "/home",
        element: <User></User>,
        children: [
            {
                path: "/home/profile",
                element: <Profile></Profile>
            },
            {
                path: "/home/properties",
                element: <Property></Property>
            },
            {
                path: "/home/addproperty",
                element: <AddProperty></AddProperty>
            },

        ]
    },
]);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={router}>
        </RouterProvider>
    </Provider>
)
