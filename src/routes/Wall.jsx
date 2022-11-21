import React, {useEffect, useState} from 'react'

import '../App.css'

import Post from "../components/Post.jsx";
import {Link} from "react-router-dom";


export default function Wall(props) {

    useEffect(() => {
        fetchPost()
    }, [])

    const [Posts, setPosts] = useState([])

    async function fetchPost() {
        const file = await fetch('http://localhost:8080/posts');
        const resp = await file.json()
        console.log('Loaded all posts');
        setPosts(resp)


    }



    return (
        <div>
            <Link to="*"> Back to home </Link>
            {Posts.map(item =>
                <Post itemData={item} key={item.id} allPosts={fetchPost} fetchPost={fetchPost}/>
            )}

        </div>
    )
}



