import './index.css'
import './App.css'
import {Link} from "react-router-dom";
import Stack from '@mui/material/Stack'

export default function App() {

    return (
        <Stack>
            <ul style={{'margin': 'auto'}}>
                <li>
                    <Link to="/newpost">Create new post</Link>
                </li>
                <li>
                    <Link to="/wall">See all posts</Link>
                </li>
                <li>
                    <Link to="/signup">Sign up</Link>
                </li>
                <li>
                    <Link to="/login">Log In</Link>
                </li>
            </ul>
        </Stack>
    )

}





