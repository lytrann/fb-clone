import '../App.css';
import React, {useEffect, useState} from "react";
import EditAvatarMenu from "./EditAvatarMenu.jsx";
import EditBannerMenu from "./EditBannerMenu.jsx";
import EditBioOptions from "./EditBioOptions";
import {useNavigate} from "react-router-dom";
import FriendListModal from "./FriendListModal";
import {Menu, MenuItem} from "@mui/material";

export default function Profile(props) {
    const sessionID = localStorage.getItem("sessionID")
    const ProfilePic = props.ProfilePic;
    const BannerPic = props.BannerPic;
    const ProfilePicName = props.ProfilePicName;
    const BannerPicName = props.BannerPicName;
    const Bio = props.Bio;
    const user = props.user;
    const showDeleteBanner = props.showDeleteBanner;
    const showDeleteAva = props.showDeleteAva;
    const [showEditBio, setShowEditBio] = props.useShowEditBio;
    const [openBioModal, setOpenBioModal] = React.useState(false);
    const [anchorAva, setAnchorAva] = useState(null);
    const [anchorResp, setAnchorResp] = useState(null);
    const person = localStorage.getItem('user')
    const [changeBio, setChangeBio] = useState(true)
    const [addFriend, setaddFriend] = useState(false)
    const [FriendText, setFriendText] = useState('')
    const navigate = useNavigate()
    const [Friend, setFriend] = useState(``);
    const [respFriendAction, setRespFriendAction] = useState(false);
    const [openFriendModal, setOpenFriendModal] = useState(false);
    const handleOpenFriendModal = () => setOpenFriendModal(true);

    useEffect(() => {
            if (person !== user) {
                checkFriend();
                setChangeBio(false);
                setaddFriend(true);
                setFriend(`see ${user}'s friends`);
            } else {
                setFriend(`see friends`)
            }
        }
        ,
        []
    );

    async function checkFriend() {
        const file = await fetch(`http://localhost:8080/getfriend?sid=${sessionID}&user=${user}`);
        const resp = await file.json();
        setFriendText(resp)
        if (resp === 'accept/reject request') {
            setFriendText('respond')
            setRespFriendAction(true)
        }
    }

    const openAva = Boolean(anchorAva);
    const AvaMenuHandleClick = (event) => {
        setAnchorAva(event.currentTarget);
    };
    const AvaMenuHandleClose = () => {
        setAnchorAva(null);
    };

    const openResp = Boolean(anchorResp);
    const RespMenuHandleClick = (event) => {
        setAnchorResp(event.currentTarget);
    };
    const RespMenuHandleClose = () => {
        setAnchorResp(null);
    };

    const [anchorBanner, setAnchorBanner] = useState(null);
    const openBanner = Boolean(anchorBanner);
    const BannerMenuHandleClick = (event) => {
        setAnchorBanner(event.currentTarget);
    };
    const BannerMenuHandleClose = () => {
        setAnchorBanner(null);
    };

    function clearSession() {
        localStorage.removeItem('user')
        localStorage.removeItem('sessionID')
    }

    async function sendReject() {
        if (person === null || person === 'guest') {
            alert('log in first');
            await clearSession()
            await navigate('*')
        } else {
            const rawResponse =
                await fetch(`http://localhost:8080/respondfriendreq?sid=${sessionID}`,
                    {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'request': event.target.id,
                            'to': user
                        })
                    });
            const content = await rawResponse.json();
            if (content === 'rejected') {
                setFriendText('add friend')
            }
            if (content === 'accepted') {
                setFriendText('unfriend')
                window.location.reload()
            } else {
                alert(content);
            }

        }
    }


    async function sendAddFriend() {
        if (person === null || person === 'guest') {
            alert(content);
            await clearSession()
            await navigate('*')
        } else {
            const rawResponse =
                await fetch(`http://localhost:8080/updatefriend?sid=${sessionID}`,
                    {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'request': FriendText,
                            'to': user
                        })
                    });
            const content = await rawResponse.json();
            if (content === 'log in first') {
                alert(content);
                await clearSession()
                await navigate('*')
            }
            if (content === 'request sent') {
                setFriendText('remove request')
            }
            if (content === 'removed') {
                setFriendText('add friend')
            } else {
                alert(content);
            }
        }
    }


    return (
        <div style={{'alignItems': 'center'}}>
            <img src={BannerPic}
                 onClick={BannerMenuHandleClick}
                 aria-controls={openBanner ?
                     "banner-pic-menu"
                     : undefined}
                 aria-expanded={openBanner ? 'true' : undefined}
                 style={{
                     'minWidth': '100%',
                     'maxHeight': '100px',
                     'objectFit': 'cover'
                 }}/>
            <img src={ProfilePic}
                 onClick={AvaMenuHandleClick}
                 aria-controls={openAva ?
                     "profile-pic-menu"
                     : null}
                 aria-expanded={openAva ? 'true' : null}
                 className="pic"
                 style={{
                     'width': '75px',
                     'height': '75px',
                     'objectFit': "cover",
                     'borderRadius': '50%',
                     'marginTop': '-20px',
                     'marginLeft': '10px',
                     'marginRight': '10px'
                 }}/>
            <div className={'ml-24'} style={{'marginTop':'-50px'}}>
                <p style={{'fontWeight': "bolder", "fontSize": "large", 'marginLeft': '10px'}}>{user}</p>
                <button onClick={handleOpenFriendModal} className={'ml-[10px]'}> {Friend} </button>
                <FriendListModal useFriendModal={[openFriendModal, setOpenFriendModal]} user={user}/>
                {addFriend ?
                    <div >
                        <button onClick={respFriendAction ? RespMenuHandleClick : sendAddFriend}
                                aria-controls={openResp ? "resp-menu" : null}
                                aria-expanded={openResp ? 'true' : null}>
                            {FriendText} </button>
                        <Menu open={openResp} id={'resp-menu'} onClose={RespMenuHandleClose}
                              anchorEl={anchorResp}>
                            <MenuItem onClick={sendReject} id='reject'>reject</MenuItem>
                            <MenuItem onClick={sendReject} id='accept'>accept</MenuItem>
                        </Menu>
                    </div>
                    : null
                }
                  </div>
                {changeBio ?
                    <EditBioOptions Bio={Bio}
                                    showEditBio={showEditBio}
                                    useOpenBioModal={[openBioModal, setOpenBioModal]}/>
                    :
                    null}
                <EditAvatarMenu id="profile-pic-menu"
                                ProfilePic={ProfilePic}
                                AnchorAva={anchorAva}
                                AvaMenuHandleClose={AvaMenuHandleClose}
                                openAva={openAva} user={user}
                                pictype={"profile-pic"}
                                showDeleteAva={showDeleteAva}
                                ProfilePicName={ProfilePicName}
                />

                <EditBannerMenu id="banner-pic-menu"
                                BannerPic={BannerPic}
                                AnchorBanner={anchorBanner}
                                BannerMenuHandleClose={BannerMenuHandleClose}
                                openBanner={openBanner} user={user}
                                pictype={"banner-pic"}
                                showDeleteBanner={showDeleteBanner}
                                BannerPicName={BannerPicName}/>

        </div>
    );
}