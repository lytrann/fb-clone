import React from 'react'
import ReactDOM from 'react-dom/client'
import router from "./router.jsx"; // add this line
import { RouterProvider } from "react-router-dom"; // add this line

import './index.css'



import {useState} from 'react'
import './App.css'
import Posts from './routes/Posts.jsx';

function App() {
    const [posts, setPosts] = useState([

    ])




    return (
        <div className="App">
            {posts.map(item => {
                return <Posts posts={item}/>
            })}

        </div>
    )
}

export default App
