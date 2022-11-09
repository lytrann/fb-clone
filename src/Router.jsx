import {createBrowserRouter} from "react-router-dom";
import Post from "./components/Post.jsx";
import NewPost from "./routes/NewPost.jsx";
import Menu from "./example_src/routes/Menu.jsx";
import Wall from "./routes/Wall.jsx"


export default createBrowserRouter([
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
    }
])


// export const Router = () => {
//     return (
//         <></>
//     )
// }