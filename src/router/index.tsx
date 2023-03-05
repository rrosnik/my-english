import * as React from "react";
import * as ReactDOM from "react-dom";
import { createBrowserRouter, } from "react-router-dom";

const AppLayout = React.lazy(() => import("../layouts/AppLayout"));

const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const SignupPage = React.lazy(() => import("../pages/SignupPage"));
const InsertPage = React.lazy(() => import("../pages/InsertPage"));
const ReviewPage = React.lazy(() => import("../pages/ReviewPage"));


const router = createBrowserRouter([
    { path: "/sign-in", element: <LoginPage /> },
    { path: "/sign-up", element: <SignupPage /> },
    {
        path: "/", element: <AppLayout />, children: [
            { path: "/insert", element: <InsertPage /> },
            { path: "/review", element: <ReviewPage /> },
        ]
    },

], { basename: "/my-english" });


export default router;