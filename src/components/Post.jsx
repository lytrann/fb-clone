import '../App.css';
import '../index.css';
import {PostAction} from "./PostAction";
import {useEffect, useState} from "react";
import ClearIcon from '@mui/icons-material/Clear';
import {Link, useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime);


const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fafafa' : '#303030',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    contentAlign: 'center',
    color: '#adadad',
    maxWidth: '30vw',
    border: 'none'
}));

export default function Post(props) {
    const navigate = useNavigate();
    const sessionID = localStorage.getItem("sessionID");
    const user = localStorage.getItem("user");
    const item = props.itemData;
    const [LikeText, setLikeText] = useState("Like");
    const [NewLike, setNewLike] = useState(item.data.likeNo);
    const [timeAgo, settimeAgo] = useState(dayjs.unix(item.data.timeStamp).fromNow());
    const [CmtCount, setCmtCount] = useState();
    const [disableDelete, setdisableDelete] = useState(false);
    const [profilePic, setProfilePic] = useState(``);
    const [allCmts, setallCmts] = useState([]);

    useEffect(() => {
            SetCreatorPic();
            DisableDelete();
            setLike();
            fetchComments();
        },
        []
    );

    function setLike() {
        const likeList = item.data.likedBy;
        if (likeList.includes(user) === true) {
            setLikeText("Liked");
        } else {
            null
        }
    }

    async function fetchComments() {
        const file = await fetch(`http://localhost:8080/getcmts?postID=${item.id}`);
        const resp = await file.json();
        console.log('a', resp)
        await setallCmts(resp);
        setCmtCount(resp.length)

    }

    function DisableDelete() {
        if (user === item.data.creator) {
            setdisableDelete(true);
        } else {
            setdisableDelete(false);
        }
    }

    async function SetCreatorPic() {
        const file = await fetch(`http://localhost:8080/profileinfo?user=${item.data.creator}`);
        const resp = await file.json();

        if (resp.profilePic === undefined) {
            setProfilePic('http://localhost:8080/getpics/defaultprofilepic.png');
        } else {
            setProfilePic(`http://localhost:8080/getpics/${resp.profilePic}`);
        }
    }

    async function SendLikeData() {
        if (user === null || user === 'guest') {
            alert('log in first');
            await navigate('*')
        } else {
            if (LikeText === 'Like') {
                item.data.request = "like";
                const rawResponse =
                    await fetch(`http://localhost:8080/updatelike?sid=${sessionID}`,
                        {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(item)
                        });
                const content = await rawResponse.json();
                if (content === 'liked') {
                    setNewLike(NewLike + 1);
                    item.data.likeNo = item.data.likeNo + 1;
                    setLikeText('Liked');
                } else {
                    alert(content);
                }
            } else {
                item.data.request = "unlike";
                const rawResponse =
                    await fetch(`http://localhost:8080/updatelike?sid=${sessionID}`,
                        {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(item)
                        });
                const content = await rawResponse.json();
                if (content === 'unliked') {
                    setNewLike(NewLike - 1);
                    item.data.likeNo = item.data.likeNo - 1;
                    setLikeText('Like');
                }
                if (content === 'log in first') {
                    alert(content);
                    await clearSession()
                    await navigate('*')
                } else {
                    alert(content);
                }
            }
        }

    }

    function clearSession() {
        localStorage.removeItem('user')
        localStorage.removeItem('sessionID')
    }

    async function SendDeletePost() {
        item.data.request = "delete";
        const rawResponse =
            await fetch(`http://localhost:8080/deletepost?sid=${sessionID}&user=${user}`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                });
        const content = await rawResponse.json();
        console.log(content);
        if (content === 'deleted') {
            await window.location.reload();
        }
        if (content === 'log in first') {
            alert(content);
            await clearSession()
            await navigate('*')
        } else {
            alert(content);
        }
    }

    return (
        <Item className={'mt-5 text-slate-400'}>
            <div>
                <div className={'flex flex-row'}>
                    <img src={profilePic}
                         className="profile-pic mx-3" alt={'user avatar'}/>
                    <div className={'flex-col'}>
                        <Link to={`/wall/${item.data.creator}`}
                              style={{'fontWeight': 'bolder'}}
                              className={'text-white'}>
                            {item.data.creator}
                        </Link>
                        <p style={{'fontSize': 'xx-small'}}>{timeAgo}</p>
                    </div>
                </div>
                {disableDelete ?
                    <button className="options"
                            style={{
                                'padding': 0,
                                'background': 'none',
                                'float': 'right',
                                'color': 'gray',
                                'marginTop': '-2rem'
                            }}
                            onClick={SendDeletePost}>
                        <ClearIcon/>
                    </button>
                    :
                    null}
            </div>

            <p className={'mt-2 ml-3 text-white'}> {item.data.content} </p>
            <div className={'flex flex-row justify-between my-1'}>
                <p className={'justify-self-start ml-3'}><ThumbUpIcon style={{'fontSize': 'small'}}/> {NewLike}</p>
                <div className={'justify-end flex-row flex'}>
                    <p className={'mx-2'}>{CmtCount} comments</p>
                    <p className={'mr-3'}>{item.data.shareNo} shares</p>
                </div>
            </div>
            <hr className={'border-slate-400/25 mx-3'}/>
            <PostAction itemData={item}
                        key={item.id}
                        SendLikeData={SendLikeData}
                        LikeText={LikeText} useCmtCount={[CmtCount, setCmtCount]}
            />

        </Item>
    )
        ;
}


