import React, {useEffect, useState} from 'react';
import '../App.css';
import {containerClasses} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import Navigation from "../components/Navigation.jsx";


export default function NewPost() {
    const [User, setUser] = useState(' ');
    const [NewPost, setNewPost] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user === null || user === 'guest') {
            navigate('*');
        } else {
            setUser(user);
        }

    }, []);

    function handleChange(event) {
        setNewPost({content: event.target.value});
    }

    const sessionID = localStorage.getItem("sessionID");

    async function handleSubmit(event) {
        event.preventDefault();
        const rawResponse =
            await fetch(`https://lytran-api.deepsel.com/createpost?sid=${sessionID}&user=${User}`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(NewPost)
                });
        const content = await rawResponse.json();
        if (content === 'log in first') {
            alert(content);
            await navigate('*');
        } else {
            navigate("/feed");
        }
    }


    return (

        <div className={containerClasses} style={{margin: '10%'}}>
            <Navigation/>
            <div className="body">
                <p id="username" className="name"/> Hello {User}
                <form onSubmit={handleSubmit} style={{alignSelf: 'center'}}>
                    <input type="text" placeholder="Write something here" name="createpost" className="input"
                           id="text" onChange={handleChange} style={{backgroundColor: 'none'}}/>
                    <Link to="/feed" type="submit" value="Submit" className="submit"
                          onClick={handleSubmit}>Submit</Link>
                </form>
            </div>
        </div>
    );
}