import {createBrowserRouter} from "react-router-dom";
import Post from "./components/Post.jsx";
import NewPost from "./routes/NewPost.jsx";
import Menu from "./example_src/routes/Menu.jsx";
import Wall from "./routes/Wall.jsx"
import InputEg from "./routes/InputEg.jsx";
import App from "./App.jsx";
import SignUp from "./routes/SignUp.jsx";
import LogIn from "./routes/LogIn.jsx";

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
        path: "/wall",
        element: <Wall/>
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
        path: "/login",
        element: <LogIn/>
    },
])


// export const Router = () => {
//     return (
//         <></>
//     )
// }