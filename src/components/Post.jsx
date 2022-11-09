import '../App.css'

import {PostAction} from "./PostAction";

export default function Post(props) {
    const item = props.itemData

    return <div>
        <p>{item.data.content}</p> <br/>
        <p> {item.data.likeno} likes</p>
        <p>{item.data.cmtno} comments</p> <p> {item.data.shareno} shares</p>

        <PostAction itemData={item}/>
    </div>;
}


