import * as React from "react";
import * as ReactDOM from "react-dom";
import { createBrowserRouter, Navigate, } from "react-router-dom";

const AppLayout = React.lazy(() => import("../layouts/AppLayout"));

const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const SignupPage = React.lazy(() => import("../pages/SignupPage"));

const CollectionPage = React.lazy(() => import("../pages/CollectionPage"));
const InsertPage = React.lazy(() => import("../pages/InsertPage"));
const ReviewPage = React.lazy(() => import("../pages/ReviewPage"));


const router = createBrowserRouter([
    { path: "/sign-in", element: <LoginPage /> },
    { path: "/sign-up", element: <SignupPage /> },
    {
        path: "/", element: <AppLayout />, children: [
            { index: true, element: <Navigate to="collections" /> },
            { path: "/collections", element: <CollectionPage /> },
            { path: "/:colId/insert", element: <InsertPage /> },
            { path: "/:colId/review", element: <ReviewPage /> },
            { path: "*", element: <Navigate to="collections" /> },
        ]
    },

], { basename: "/my-english" });


export default router;