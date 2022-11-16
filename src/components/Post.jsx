import '../App.css';
import '../index.css';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import {Stack} from "@mui/material";
import Paper from '@mui/material/Paper';
import {PostAction} from "./PostAction";
import {useState} from "react";


export default function Post(props) {

    const item = props.itemData
    const allposts = props.allposts
    const [Posts, setPost] = useState(item)
    const [NewLike, setNewLike] = useState(item.data.likeno)
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        contentAlign: 'center',
        color: theme.palette.text.secondary,
        maxWidth: '30vw',
        border: 'none'
    }));


    async function SendLikeData() {
        const rawResponse = await fetch('http://localhost:8080/updatelike', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        const content = await rawResponse.json();
        await console.log('here', content);
        setNewLike(NewLike + 1)
    }

    async function SendDeleteData() {
        console.log(item)

        const rawResponse = await fetch('http://localhost:8080/deletepost', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        const content = await rawResponse.json();
        console.log(content)

        props.fetchPost()
    }

        return (
            <Stack spacing={20}>
                <Item style={{'marginBottom': '10px'}}>
                    <Stack direction="row">
                        <div> {item.data.content} </div>
                        <br/>
                        <Button className="options" style={{'padding': 0, 'alignSelf': 'end'}}
                                onClick={SendDeleteData}>Delete</Button>
                    </Stack>
                    <Grid container spacing={4}>
                        <Grid item>
                            <p> {NewLike} likes</p>
                        </Grid>
                        <Grid item>
                            <div></div>
                        </Grid>
                        <Grid item>
                            <p>{item.data.cmtno} comments</p>
                        </Grid>
                        <Grid item>
                            <p>{item.data.shareno} shares</p>
                        </Grid>
                    </Grid>


                    <PostAction itemData={item} SendLikeData={SendLikeData}/>
                </Item>
            </Stack>
        )
    }


