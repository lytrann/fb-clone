import {createBrowserRouter} from "react-router-dom";
import Posts from "./routes/Posts.jsx";
import {NewPost} from "./routes/NewPost.jsx";
import Menu from "./example_src/routes/Menu.jsx";


export default createBrowserRouter([
    {
        path: "/posts",
        element: <Posts/>,
    },
    {
        path: "/newpost",
        element: <NewPost/>
    },
    {
        path: "/example",
        element: <Menu/>
    }
])

// export const Router = () => {
//     return (
//         <></>
//     )
// }