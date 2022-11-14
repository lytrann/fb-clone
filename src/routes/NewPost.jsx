import React, {useState} from 'react'

import '../App.css'
import {containerClasses} from "@mui/material";
import Container from '@mui/material/Container';
import {useNavigate} from "react-router-dom";


export default function NewPost() {


    const [NewPost, setNewPost] = useState('');
    const navigate = useNavigate()

    function handleChange(event) {
        console.log(event.target)
        setNewPost({content: event.target.value});
    }

    async function handleSubmit(event) {

        console.log('handleSubmit')
        event.preventDefault();
        const rawResponse = await fetch('http://localhost:8080/newpost', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(NewPost)
        })
        await console.log(rawResponse)
        const content = await rawResponse.json();
        console.log('here', content);
        navigate("/wall");


    }


    return (

        <div className={containerClasses} style={{margin: '10%'}}>
            <Container className="heading" style={{flexFlow: 'column wrap'}}>
                <p className="createpost" style={{alignSelf: 'flex-end'}}>Create post </p>
                <button className="cancel"> X</button>
            </Container>

            <div className="body">
                <h1 id="username" className="name">Đậu</h1>
                <form onSubmit={handleSubmit} style={{alignSelf: 'center'}}>
                    <label>
                        <input type="text" placeholder="Write something here" name="createpost" className="input"
                               id="text" onChange={handleChange} style={{backgroundColor: 'none'}}/>
                    </label>
                    <input type="submit" value="Submit" className="submit"/>
                </form>
            </div>
        </div>

    )
}