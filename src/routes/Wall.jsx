import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Post from "../components/Post.jsx";
import {styled} from '@mui/material/styles';
import {Stack} from "@mui/material";
import Paper from '@mui/material/Paper';
import Profile from '../components/Profile.jsx';
import Navigation from "../components/Navigation.jsx";


const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fafafa' : '#303030',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    contentAlign: 'center',
    color: '#adadad',
    maxWidth: '30vw',
    border: 'none'
}));


export default function Wall() {
    let username = useParams();
    const user = username.user;

    const [UserPost, setUserPost] = useState([]);
    const [ProfilePicName, setProfilePicName] = useState();
    const [BannerPicName, setBannerPicName] = useState();
    const [ProfilePic, setProfilePic] = useState();
    const [BannerPic, setBannerPic] = useState();
    const [Bio, setBio] = useState('');
    const [showDeleteAva, setshowDeleteAva] = useState(false);
    const [showDeleteBanner, setshowDeleteBanner] = useState(false);
    const [showEditBio, setShowEditBio] = useState(false);

    async function fetchInfo() {
        const file = await fetch(`http://lytran.deepsel.com/profileinfo?user=${username.user}`);
        const resp = await file.json();

        if (resp.profilePic === undefined) {
            setProfilePic('http://lytran.deepsel.com/getpics/defaultprofilepic.png');
        } else {
            setProfilePic(`http://lytran.deepsel.com/getpics/${resp.profilePic}`);
            setshowDeleteAva(true);
            setProfilePicName(resp.profilePic);
        }

        if (resp.bannerPic === undefined) {
            setBannerPic('http://lytran.deepsel.com/getpics/defaultbannerpic.jpeg');
        } else {
            setBannerPic(`http://lytran.deepsel.com/getpics/${resp.bannerPic}`);
            setshowDeleteBanner(true);
            setBannerPicName(resp.bannerPic);
        }

        if (resp.bio === undefined) {
            setShowEditBio(false);
        } else {
            setBio(resp.bio);
            setShowEditBio(true);
        }

    }

    async function fetchPosts() {
        const file = await fetch(`http://lytran.deepsel.com/userpost?user=${username.user}`);
        const resp = await file.json();
        setUserPost(resp);
    }

    useEffect(() => {
            fetchInfo()
            fetchPosts()
        }
        ,
        []
    );

    return (
        <div className="body">
            <Navigation/>
            <Stack style={{"alignSelf": "center", 'minWidth':'35%'}}>
                <Item style={{'marginTop': "10px"}}>
                    <Profile ProfilePic={ProfilePic} BannerPic={BannerPic}
                             Bio={Bio} user={user}
                             showDeleteAva={showDeleteAva}
                             showDeleteBanner={showDeleteBanner}
                             useShowEditBio={[showEditBio, setShowEditBio]}
                             ProfilePicName={ProfilePicName}
                             BannerPicName={BannerPicName}

                    />
                </Item>
                {UserPost.map(item =>
                    <Post itemData={item}
                          key={item.id}
                          allPosts={fetchPosts}/>)}
            </Stack>
        </div>
    );
}