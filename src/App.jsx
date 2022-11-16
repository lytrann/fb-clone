import './index.css'
import './App.css'
import {Link, Route, Routes} from "react-router-dom";
import NewPost from "./routes/NewPost.jsx";
import Wall from "./routes/Wall.jsx";

export default function App() {

    return (
        <div>

            <nav>
                <ul>
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
            </nav>
            <Routes>
                <Route path="/newpost" element={<NewPost/>}/>
                <Route path="/wall" element={<Wall/>}/>
            </Routes>
        </div>
    )

}





