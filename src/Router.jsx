import {createBrowserRouter} from "react-router-dom";
import Post from "./components/Post.jsx";
import NewPost from "./routes/NewPost.jsx";
import Menu from "./example_src/routes/Menu.jsx";
import Wall from "./routes/Wall.jsx"
import InputEg from "./routes/InputEg.jsx";


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
<<<<<<< HEAD
        path: "/wall",
        element: <Wall/>
=======
        path: "/input",
        element: <InputEg/>
>>>>>>> 96e7094908c741d6b875ec2cc979ffc0edeb5a91
    }
])


// export const Router = () => {
//     return (
//         <></>
//     )
// }