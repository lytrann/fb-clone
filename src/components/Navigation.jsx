import Container from "@mui/material/Container";
import {Link, useNavigate} from "react-router-dom";
import {React, useEffect, useState} from "react";
import FriendRequestModal from "./FriendRequestModal";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import {Menu, MenuItem} from "@mui/material";
import FriendListModal from "./FriendListModal";

export default function Navigation() {
    const [ShowUser, setShowUser] = useState(false);
      const [openFriendReqModal, setOpenFriendReqModal] = useState(false);
    const handleOpenFriendReqModal = () => setOpenFriendReqModal(true);
    const [openFriendModal, setOpenFriendModal] = useState(false);
    const handleOpenFriendModal = () => setOpenFriendModal(true);
    const navigate = useNavigate();
    useEffect(() => {
            if (localStorage.getItem("sessionID") !== null) {
                setShowUser(true);
            } else {
                setShowUser(false);
            }
        }
        ,
        []
    )

    function logOut() {
        localStorage.removeItem('sessionID');
        localStorage.removeItem('user');
        navigate("*");
    }

    const [anchorMenu, setAnchorMenu] = useState(null);
    const openMenu = Boolean(anchorMenu);
    const MenuHandleClick = (event) => {
        setAnchorMenu(event.currentTarget);
    };
    const MenuHandleClose = () => {
        setAnchorMenu(null);
    };

    return (
        <Container className="heading" style={{flexFlow: 'column wrap'}}>
            <Link to="*"> <HomeIcon></HomeIcon> </Link>
            <button onClick={MenuHandleClick}
                    aria-controls={openMenu ?
                        "friend-menu"
                        : undefined}
                    aria-expanded={openMenu ? 'true' : undefined}><PeopleIcon></PeopleIcon></button>
            <Menu open={openMenu}
                  anchorEl={anchorMenu}
                  onClose={MenuHandleClose}
                  id="friend-menu">
                <MenuItem onClick={handleOpenFriendReqModal}>friend requests</MenuItem>
                <FriendRequestModal useFriendModal={[openFriendReqModal, setOpenFriendReqModal]}/>
                <MenuItem onClick={handleOpenFriendModal}>friend list</MenuItem>
                <FriendListModal useFriendModal={[openFriendModal, setOpenFriendModal]} user={localStorage.getItem('user')}/>
            </Menu>
                {ShowUser ?
                    <div>
                        <button onClick={logOut}
                                style={{
                                    'color': "#db5248",
                                    'fontSize': 'small'
                                }}>
                            log out
                        </button>
                    </div>
                    :
                    null}
        </Container>
);
}