import '../App.css'
import {useEffect, useState} from "react";

export default function Posts(props) {
    const [post, setpost] = useState()

    async function fetchPost() {
        const file = await fetch('http://localhost:8080/posts');
        const resp = await file.json()
        console.log(resp);
            //   for (let i = 0; i < resp.length; i++) {
            //     function displayPost() {
            //         return
            //         <p> {resp.data.content} </p>
            //         <p> </p>
            //         <p>  </p>
            //     }
            // }


    }

    useEffect(() => {
        console.log('herer')
        fetchPost()
    }, [])

    return (
        <div>



            <button>Like</button>
        </div>
    )
}