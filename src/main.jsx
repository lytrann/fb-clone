import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/Post.jsx';
import router from "./router.jsx";
import { RouterProvider } from "react-router-dom";


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>)


function main() {
    return (<div>
        <button> Create new post</button>
        <button> See all posts</button>
    </div>)
}

export default main