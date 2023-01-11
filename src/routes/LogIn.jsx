import React, {useEffect, useState} from 'react';
import '../App.css';
import {containerClasses} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


export default function LogIn() {
    const navigate = useNavigate();
    useEffect(() => {
            checkSession();
        }
        ,
        []
    );

    async function checkSession() {
        if (localStorage.getItem("sessionID") !== null) {
            navigate('/feed')
        }
    }

    const [Username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password");

    const togglePassword = (e) => {
        e.preventDefault();
        if (passwordType === "password") {
            setPasswordType("text");
        } else {
            setPasswordType("password");
        }
    }

    function ChangeUsername(event) {
        event.preventDefault();
        setUsername(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const rawResponse =
            await fetch('http://localhost:8080/olduser',
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            'username': Username,
                            'password': password
                        })
                });
        const content = await rawResponse.json();
        if (content === 'user does not exist, sign up?') {
            if (confirm(content)) {
                navigate('/signup')
            } else {
                event.preventDefault()
            }
        } else {
            if (content.loggedIn) {
                localStorage.setItem('sessionID', content.sid)
                localStorage.setItem('user', content.user)
                navigate("/feed")
            } else {
                event.preventDefault()
                alert(content)
            }
        }
    }


    return (
        <div className={containerClasses} style={{margin: '10%'}}>

            <p className={'mx-3'} style={{'fontWeight': 'bolder'}}>Log In </p>
            <hr className={'border-slate-400/25 mx-3'}/>

            <div className="body">
                <form onSubmit={handleSubmit} style={{'alignSelf': 'center', 'alignItems': 'center'}}>
                    <label/> user name
                    <br/>
                    <input type="text"
                           id="username"
                           onChange={ChangeUsername}
                           style={{backgroundColor: 'none'}}
                           required/>
                    <br/>
                    <label/>password
                    <br/>
                    <input type={passwordType}
                           onChange={e => setPassword(e.target.value)}
                           required/>
                    <button className="btn btn-outline-primary" onClick={togglePassword}/>
                    {passwordType === "password" ? <VisibilityOffIcon/> : <RemoveRedEyeIcon/>}
                    <br/>
                    <br/>
                    <button type="submit" value="submit" className="submit" style={{'alignSelf': 'center'}}>Log in</button>
                    <br/>
                </form>
                <hr className={'border-slate-400/25 mx-3'}/>
                <br/>
                <Link to={'/signup'} style={{'fontWeight': 'bolder', 'alignSelf': 'center'}}>sign up</Link>
            </div>
        </div>
    );
}