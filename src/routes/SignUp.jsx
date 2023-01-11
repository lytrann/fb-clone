import React, {useEffect, useState} from 'react'
import '../App.css'
import {containerClasses} from "@mui/material";
import Container from '@mui/material/Container';
import {Link, useNavigate} from "react-router-dom";
import PasswordChecklist from "react-password-checklist";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


export default function SignUp() {
    const [NewEmail, setNewEmail] = useState('');
    const [NewName, setNewName] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [passwordType, setPasswordType] = useState("password");
    const [passwordAgainType, setPasswordAgainType] = useState("password");
    const [Valid, setValid] = useState(false)

    const togglePassword = (e) => {
        e.preventDefault();
        if (passwordType === "password") {
            setPasswordType("text");
        }
        else {
            setPasswordType("password")
        }
    }

    const togglePasswordAgain = (e) => {
        e.preventDefault();
        if (passwordAgainType === "password") {
            setPasswordAgainType("text");
        }
        else {
            setPasswordAgainType("password");
        }
    }

    function ChangeEmail(event) {
        event.preventDefault();
        setNewEmail(event.target.value);
    }

    function ChangeName(event) {
        event.preventDefault();
        setNewName(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const rawResponse =
            await fetch('http://localhost:8080/newuser',
                {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    'email': NewEmail,
                    'name': NewName,
                    'password': password,
                }
            )
        });
        const content = await rawResponse.json();
        if (confirm(content)) {
            navigate('/login')
        }
        else {event.preventDefault()}
    }

    return (
        <div className={containerClasses} style={{margin: '10%'}}>
            <Container className="heading" style={{flexFlow: 'column wrap'}}>
                <p style={{'fontWeight':'bolder'}}>Sign Up </p>
                <Link to="*"> Back to home </Link>
            </Container>
            <div className="body">
                <form onSubmit={handleSubmit} style={{alignSelf: 'center'}}>
                    <label/>email
                    <br/>
                    <input type="email"
                           id="email"
                           onChange={ChangeEmail}
                           style={{backgroundColor: 'none'}}
                           required/>
                    <br/>
                    <label/>display name
                    <br/>
                    <input type="text"
                           id="username"
                           onChange={ChangeName}
                           style={{backgroundColor: 'none'}}
                           required/>
                    <br/>

                    <label/>password
                    <br/>
                    <input type={passwordType}
                           onChange={e => setPassword(e.target.value)}
                           required/>
                    <button className="btn btn-outline-primary"
                            onClick={togglePassword}>
                        {passwordType === "password" ? <VisibilityOffIcon/> : <RemoveRedEyeIcon/>}
                    </button>
                    <br/>

                    <label/> verify password
                    <br/>
                    <input type={passwordAgainType}
                           onChange={e => setPasswordAgain(e.target.value)}
                           required/>
                    <button className="btn btn-outline-primary"
                            onClick={togglePasswordAgain}>
                        {passwordAgainType === "password" ? <VisibilityOffIcon/> : <RemoveRedEyeIcon/>}
                    </button>
                    <br/>
                    <br/>
                    <PasswordChecklist
                        rules={["minLength", "match", "notEmpty"]}
                        minLength={6}
                        value={password}
                        valueAgain={passwordAgain}
                        onChange={(isValid) => {
                            console.log({isValid})
                            setValid(!isValid)
                        }}/>
                    <br/>
                    <button type="submit"
                            value="Submit"
                            className="submit"
                            disabled={Valid}
                    >Sign up
                    </button>
                </form>
            </div>
        </div>
    );
}