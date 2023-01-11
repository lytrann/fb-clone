import {createBrowserRouter} from "react-router-dom";
import Post from "./components/Post.jsx";
import NewPost from "./routes/NewPost.jsx";
import Menu from "./example_src/routes/Menu.jsx";
import Feed from "./routes/Feed.jsx"
import InputEg from "./routes/InputEg.jsx";
import LogIn from "./routes/LogIn.jsx";
import SignUp from "./routes/SignUp.jsx";
import Wall from './routes/Wall.jsx';

export default createBrowserRouter([

    {
        path: "*",
        element: <LogIn/>,
    },
    {
        path: "/posts",
        element: <Post/>,
    },
    {
        path: "/newpost",
        element: <NewPost/>
    },
    {
        path: "/example",
        element: <Menu/>
    },
    {
        path: "/feed",
        element: <Feed/>
    },
    {
        path: "/input",
        element: <InputEg/>
    },
    {
        path: "/signup",
        element: <SignUp/>
    },
    {
        path: '/wall/:user',
        element: <Wall/>
    },
    {
        path: '/test',
        element: <Test/>
    }
])
