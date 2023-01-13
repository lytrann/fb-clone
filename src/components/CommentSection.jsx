import * as React from 'react';
import {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Comment from './Comment.jsx';

export default function CommentSection(props) {
    const [userCmt, setUserCmt] = useState(undefined);
    const sessionID = localStorage.getItem("sessionID");
    const user = localStorage.getItem("user");
    const item = props.itemData;
    const [allCmts, setallCmts] = props.useallCmts;
    const [CmtCount, setCmtCount] = props.useCmtCount;
    const [profilePic, setProfilePic] = useState(``);

    useEffect(() => {
            SetUserPic();
            // const keyDownHandler = event => {
            //     console.log('User pressed: ', event.key);
            //     if (event.key === 'Enter') {
            //         event.preventDefault();
            //         postComment();
            //     }
            // }
            // document.addEventListener('keydown', keyDownHandler);
            // return () => {
            //     document.removeEventListener('keydown', keyDownHandler)
            // }

        },
        []
    )
    ;

    async function SetUserPic() {
        const file = await fetch(`https://lytran-api.deepsel.com/profileinfo?user=${localStorage.getItem("user")}`);
        const resp = await file.json();

        if (resp.profilePic === undefined) {
            setProfilePic('https://lytran-api.deepsel.com/getpics/defaultprofilepic.png');
        } else {
            setProfilePic(`https://lytran-api.deepsel.com/getpics/${resp.profilePic}`);
        }
    }


    function changeInput(e) {
        setUserCmt(e.target.value)
    }

    async function postComment() {
        event.preventDefault();
        console.log(item.data.cmtNo)
        const rawResponse =
            await fetch(`https://lytran-api.deepsel.com/postcmt?sid=${sessionID}&user=${user}`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'postData': item,
                        'cmtData': userCmt
                    })
                });
        const resp = await rawResponse.json();
        setUserCmt('')
        if (allCmts.length === 0) {
            await setallCmts(resp)
            await setCmtCount(allCmts.length + 1);
            item.data.cmtNo = CmtCount;
        }
        if (resp === 'log in first') {
            alert(resp);
            await localStorage.removeItem("sessionID");
            await localStorage.removeItem("user");
            await navigate('*')
        } else {
            await setCmtCount(allCmts.length + 1)
            item.data.cmtNo = CmtCount
            await setallCmts([
                ...allCmts,
                resp
            ])
            await setCmtCount(allCmts.length + 1)
            item.data.cmtNo = CmtCount
            await console.log(item.data.cmtNo)
        }


    }


    return (
        <Stack>
            {allCmts.length === 0 ? null : <div>
                {allCmts.map(cmt =>
                    <Comment
                        cmtData={cmt}
                        key={cmt.id}
                        itemData={item}
                        useCmtCount={[CmtCount, setCmtCount]}
                        useallCmts={[allCmts, setallCmts]}
                        profilePic={profilePic}
                    />
                )}
            </div>}
            <div className={'flex flex-row mt-3'}>
                <img src={profilePic} alt="profilePic" className="profile-pic mx-3"/>
                <form onSubmit={postComment} className={'flex flex-row mr-3 w-full'}>
                    <input required
                           type={'text'}
                           id="outlined-basic"
                           placeholder="write a comment"
                           value={userCmt}
                           onChange={changeInput}
                           className={'rounded-3xl h-[35px] indent-2 border-none grow-2 bg-stone-600/25 w-full'}
                    />
                    <button type="submit"
                            value="Submit"
                            className="submit justify-self-end">
                        post
                    </button>
                </form>
            </div>
        </Stack>
    );
}
