import React, {useState} from 'react'

import '../App.css'
import {containerClasses} from "@mui/material";
import Container from '@mui/material/Container';
import {Link, useNavigate} from "react-router-dom";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';


export default function logIn() {

    const [Username, setUsername] = useState("")

    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password");


    const togglePassword = (e) => {
        e.preventDefault();
        if (passwordType === "password") {
            setPasswordType("text")

        } else {
            setPasswordType("password")
        }
    }

    function ChangeUsername(event) {
        event.preventDefault();
        setUsername(event.target.value);


    }

    async function handleSubmit(event) {

        event.preventDefault();
        console.log({Username, password})
        const rawResponse = await fetch('http://localhost:8080/olduser', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    'username': Username,
                    'password': password
                }
            )
        })
        await console.log(rawResponse);
        const content = await rawResponse.json();
        const cue = content.search()
        console.log(cue)
        if (content === 'user does not exist, sign up?') {
            if (confirm(content)) {
                navigate('/signup')
            } else {
                event.preventDefault()
            }
        } else {
            if (cue === 0) {
                navigate("/wall")
            } else {
                event.preventDefault()
                console.log(content)
            }
        }
    }


    return (

        <div className={containerClasses} style={{margin: '10%'}}>
            <Container className="heading" style={{flexFlow: 'column wrap'}}>
                <p className="createpost" style={{alignSelf: 'flex-end'}}>Log in </p>
                <Link to="*"> Back to home </Link>
            </Container>

            <div className="body">
                <form onSubmit={handleSubmit} style={{alignSelf: 'center'}}>

                    <label> user name</label><br/>
                    <input type="text"
                           id="username" onChange={ChangeUsername} style={{backgroundColor: 'none'}} required/><br/>

                    <label>password</label><br/>
                    <input type={passwordType} onChange={e => setPassword(e.target.value)} required/>
                    <button className="btn btn-outline-primary" onClick={togglePassword}>
                        {passwordType === "password" ? <VisibilityOffIcon/> : <RemoveRedEyeIcon/>}
                    </button>
                    <br/>
                    <br/>
                    <Button type="submit" value="Submit" className="submit"

                    >Log in</Button>


                </form>
            </div>
        </div>

    )
}