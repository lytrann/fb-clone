import {createBrowserRouter} from "react-router-dom";
import Posts from "./routes/Posts.jsx";
import {NewPost} from "./routes/NewPost.jsx";


export default createBrowserRouter([
  {
    path: "/posts",
    element: <Posts/>,
  },
  {
    path: "/newpost",
    element: <NewPost/>
  }
])

// export const Router = () => {
//     return (
//         <></>
//     )
// }