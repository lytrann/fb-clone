import * as React from 'react';
import {useState} from 'react';
import CommentSection from "./CommentSection.jsx";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ReplyIcon from '@mui/icons-material/Reply';

export const PostAction = (props) => {
    const item = props.itemData;
    const SendLikeData = props.SendLikeData;
    const LikeText = props.LikeText;
    const [showComments, setShowComments] = useState(false);
    const [allCmts, setallCmts] = props.useallCmts;
    const [CmtCount, setCmtCount] = props.useCmtCount;



    return (
        <div>
            <div className="actions flex flex-row justify-evenly my-1">
                <button value="like" onClick={SendLikeData} style={{'fontWeight': 'bold'}}>
                    <ThumbUpIcon/>
                    {' ' + LikeText}
                </button>
                <button onClick={() => {setShowComments(!showComments)}} style={{'fontWeight': 'bold'}}><ChatBubbleIcon/> Comment</button>
                <button id={item.id + " ShareButton"} style={{'fontWeight': 'bold'}}><ReplyIcon/> Share</button>
            </div>
              <hr className={'border-slate-400/25 mx-3'}/>
            {showComments ?
                <div>
                    <CommentSection
                        itemData={item}
                        useallCmts={[allCmts, setallCmts]}
                        useCmtCount={[CmtCount, setCmtCount]}
                    >
                    </CommentSection>
                </div>
                :
                null
            }
        </div>
    );
}