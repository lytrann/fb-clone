import {useEffect, useState} from "react";
import {Modal, Paper} from "@mui/material";
import Container from "@mui/material/Container";
import {Link, useNavigate} from "react-router-dom";
import RespFriendReq from "./RespFriendReq";

export default function FriendRequestModal(props) {
    const [FriendList, setFriendList] = useState([]);
    const [openFriendModal, setOpenFriendModal] = props.useFriendModal;
    const handleCloseFriendModal = () => setOpenFriendModal(false);
    const sessionID = localStorage.getItem("sessionID");
    const user = localStorage.getItem("user");
    const heading = `Friend Requests`;

    useEffect(() => {
            getFriendList();
        }
        ,
        []
    );

    async function getFriendList() {
        const file = await fetch(`http://localhost:8080/friendreqlist?sid=${sessionID}&user=${user}`);
        const resp = await file.json();
        await console.log('friends', resp)
        if (resp.length === 0) {
            setFriendList(false)
        }
        setFriendList(resp)
    }


    return (
        <Modal
            open={openFriendModal}
            onClose={handleCloseFriendModal}
            aria-labelledby="friendList"
        >
            <Container id="friendList" style={{'margin-top': '10%'}}>
                <Paper>
                    <h1>{heading}</h1>
                    <br/>
                    <ul>
                        {FriendList.map((friend) =>
                            <div key={friend}>
                                <Link
                                    to={`/wall/${friend}`}
                                    onClick={window.location.reload}
                                    style={{'fontWeight': 'bolder'}}>
                                    {friend}
                                </Link>
                                <RespFriendReq user={friend}></RespFriendReq>
                                <br/>
                            </div>)}
                    </ul>
                </Paper>
            </Container>
        </Modal>
    );
}
