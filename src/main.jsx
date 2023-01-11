import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/Post.jsx';
import router from './Router.jsx';
import {RouterProvider} from "react-router-dom";
import LogIn from "./routes/LogIn";


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>)

