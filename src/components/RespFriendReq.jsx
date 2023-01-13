import React from "react";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

export default function RespFriendReq(props) {
    const sessionID = localStorage.getItem("sessionID");
    const user = props.user

    async function sendResp() {
        console.log(event.target)
        const rawResponse = await fetch(`https://lytran-api.deepsel.com/respondfriendreq?sid=${sessionID}`,
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
        await alert(content);
        await window.location.reload()
    }

    return (
        <div>
            <button id="accept" onClick={sendResp}><CheckBoxIcon/></button>
            <button id="reject" onClick={sendResp}><DisabledByDefaultIcon/></button>
        </div>
    )
}