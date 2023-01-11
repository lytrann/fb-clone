import React, {useEffect, useState} from 'react';
import '../App.css';
import Post from "../components/Post.jsx";
import Stack from "@mui/material/Stack";
import Navigation from "../components/Navigation.jsx";


export default function Feed() {
    const sessionID = localStorage.getItem("sessionID");
    let user = localStorage.getItem("user");
    const [Posts, setPosts] = useState([])
    const [profilePic, setProfilePic] = useState('')

    useEffect(() => {
            fetchPost();

        }
        ,
        []
    );



    async function fetchPost() {
        const file = await fetch(`http://localhost:8080/posts?sid=${sessionID}`);
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