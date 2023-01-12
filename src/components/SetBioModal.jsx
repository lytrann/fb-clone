import {Modal, Paper} from "@mui/material";
import {Link} from "react-router-dom";
import {React, useState} from "react";

export default function SetBioModal(props) {

    const openBioModal = props.openBioModal
    const handleCloseBioModal = props.handleCloseBioModal
    const [NewBio, setNewBio] = useState('');
    const sessionID = localStorage.getItem("sessionID")

    function handleChange(event) {
        setNewBio({content: event.target.value});
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const rawResponse =
            await fetch(`http://lytran.deepsel.com/setbio?sid=${sessionID}`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(NewBio)
                });
        const content = await rawResponse.json();
        if (content === 'log in first') {
            alert(content)
            await navigate('*')
        } else {
            navigate("/feed");
        }
    }

    return (
        <Modal
            open={openBioModal}
            onClose={handleCloseBioModal}
            aria-labelledby="BioModal-modal-title"
            aria-describedby="BioModal-modal-description">
            <Paper>
                <h1 id="BioModal-modal-title">
                    Add bio
                </h1>
                <form onSubmit={handleSubmit} style={{alignSelf: 'center'}}>
                    <input type="text" placeholder="write something here" name="setbio"
                           className="input"
                           id="text" onChange={handleChange} style={{backgroundColor: 'none'}}/>
                    <Link to="/feed" type="submit" value="Submit" className="submit"
                          onClick={handleSubmit}>set</Link>
                </form>
            </Paper>
        </Modal>
    );
}