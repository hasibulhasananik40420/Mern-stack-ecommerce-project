import { createBrowserRouter } from "react-router-dom"
import Main from "../main/Main"
import Home from "../pages/Home/Home"
import Signup from "../pages/Auth/Signup/Signup"
import Login from "../pages/Auth/Login/Login"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"


const routes = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/sign-up",
                element: <Signup />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "*",
                element: <NotFoundPage />
            },
           

        ]

    }
])


export default routes