import React, {useEffect, useState} from 'react';
import '../App.css';
import Post from "../components/Post.jsx";
import Stack from "@mui/material/Stack";
import Navigation from "../components/Navigation.jsx";
import {useNavigate} from "react-router-dom";


export default function Feed() {
    const sessionID = localStorage.getItem("sessionID");
    let user = localStorage.getItem("user");
    const navigate = useNavigate();
    const [Posts, setPosts] = useState([])

    useEffect(() => {
           reRoute();
        }
        ,
        []
    );

    function reRoute() {
        if (sessionID === null) {
            navigate('*')
        }
        else {
            fetchPost();
        }
    }

    async function fetchPost() {
        const file = await fetch(`https://lytran-api.deepsel.com/posts?sid=${sessionID}`);
        const resp = await file.json();
        setPosts(resp)
        Posts.sort((a, b) => {
            a.data.timeStamp - b.data.timeStamp
        });
    }

    return (
        <div>
            <Navigation/>
            <div className="body">
                <Stack style={{"alignSelf": "center", 'minWidth': '35%'}}>
                    {Posts.map(item =>
                        <Post itemData={item}
                              key={item.id}
                              sessionID={sessionID}
                              user={user}
                              />
                    )}
                </Stack>
            </div>
        </div>
    );
}