import React, {useEffect, useState} from 'react'

import '../App.css'

import Post from "../components/Post.jsx";


export default function Wall() {

    useEffect(() => {
        fetchPost()
    }, [])

    const [posts, setposts] = useState([])

    async function fetchPost() {
        const file = await fetch('http://localhost:8080/posts');
        const resp = await file.json()
        console.log({resp});
        setposts(resp)
    }

    return (
        <div>
            {posts.map(item =>
                <Post itemData={item} key={item.id}/>
            )}

        </div>
    )
}



