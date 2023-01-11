import {useEffect, useState} from "react";
import {Modal, Paper} from "@mui/material";
import Container from "@mui/material/Container";
import {Link} from "react-router-dom";

export default function FriendListModal(props) {
    const [FriendList, setFriendList] = useState([]);
    const [openFriendModal, setOpenFriendModal] = props.useFriendModal;
    const handleCloseFriendModal = () => setOpenFriendModal(false);
    const sessionID = localStorage.getItem("sessionID");
    const user = props.user;
    const heading = `${user}'s Friends`;


    useEffect(() => {
            getFriendList();
        }
        ,
        []
    );

    async function getFriendList() {
        const file = await fetch(`http://localhost:8080/friendlist?sid=${sessionID}&user=${user}`);
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
                                <br/>
                            </div>)}
                    </ul>
                </Paper>
            </Container>
        </Modal>
    );
}