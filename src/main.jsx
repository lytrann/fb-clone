import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/Post.jsx';
import router from "./router.jsx";
import {RouterProvider} from "react-router-dom";
import {BrowserRouter as Router} from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>)


function main() {
    return (<Router>
        <App>
        </App>
    </Router>)
}

export default main