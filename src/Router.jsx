import {createBrowserRouter} from "react-router-dom";
import Post from "./components/Post.jsx";
import NewPost from "./routes/NewPost.jsx";
import Menu from "./example_src/routes/Menu.jsx";
import Feed from "./routes/Feed.jsx"
import InputEg from "./routes/InputEg.jsx";
import App from "./App.jsx";
import SignUp from "./routes/SignUp.jsx";
// import LogIn from "./routes/LogIn.jsx";
import Wall from './routes/Wall.jsx';
import Test from './routes/Test.jsx';

export default createBrowserRouter([

    {
        path: "*",
        element: <App/>,
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
    // {
    //     path: "/login",
    //     element: <LogIn/>
    // },
    {
        path: '/wall/:user',
        element: <Wall/>
    },
    {
        path: '/test',
        element: <Test/>
    }
])
