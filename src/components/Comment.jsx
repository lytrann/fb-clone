import * as React from "react";
import {useEffect, useState} from "react";
import ClearIcon from '@mui/icons-material/Clear';
import {Link} from "react-router-dom";



export default function Comment(props) {

    const cmt = props.cmtData;
    const item = props.itemData;
    const [CmtCount, setCmtCount] = props.useCmtCount;
    const [allCmts, setallCmts] = props.useallCmts;
    const [showDelete, setshowDelete] = useState(false);
    const sessionID = localStorage.getItem("sessionID");
    let user = localStorage.getItem("user");
    const [CmtState, setCmtState] = useState(false);
    const profilePic = props.profilePic;

    useEffect(() => {
        console.log(cmt)
            if (user === cmt.data.commentor) {
                setshowDelete(true);
            } else {
                setshowDelete(false);
            }
        }
        ,
        []
    );


    async function SendDeleteCmt() {
        cmt.data.request = "delete";
        const rawResponse =
            await fetch(`http://lytran.deepsel.com/deletecmt?sid=${sessionID}&user=${user}`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'postData': item,
                        'cmtData': cmt
                    })
                });
        const content = await rawResponse.json();
        if (content.deleted === true) {
            setCmtState(!CmtState);
            setCmtCount(CmtCount - 1);
            item.data.cmtNo = item.data.cmtNo - 1;
            const index = allCmts.findIndex(a => a.id === content.cmtID);
            const newAllCmts = [...allCmts];
            newAllCmts.splice(index, 1);
            setallCmts(newAllCmts);
        } else {
            alert(content);
        }
    }

    return (

        <div className={'flex flex-row my-2'}>
            <img src={profilePic}
                 className="profile-pic ml-3" alt={'user avatar'}/>
            <div
                 className={'flex flex-row mx-3 rounded-2xl bg-stone-600/25'}>
                <div className={'flex-col mx-3 my-1'}>
                    <Link to={`/wall/${cmt.data.commentor}`}
                          style={{'fontWeight': 'bolder'}}
                          className={'text-white'}>
                        {cmt.data.commentor}
                    </Link>
                    <p>{cmt.data.content}</p>
                </div>
                {showDelete ?
                    <button className="options justify-self-end"
                            style={{'padding': 0, 'background': 'none', 'float': 'right', 'color': 'gray', 'marginTop': '-1rem'}}
                            onClick={SendDeleteCmt}>
                        <ClearIcon style={{'fontSize': 'small'}}/>
                    </button>
                    :
                    null}

            </div>
        </div>
    );
}