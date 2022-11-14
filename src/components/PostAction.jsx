import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {ToggleButton} from "@mui/material";
import {useState} from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'


export const PostAction = (props) => {
    const Button = styled(Paper)(({theme}) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const item = props.itemData
    const likedata = props.SendLikeData;
    const deletedata = props.SendDeleteData;




    return (
        <div className="actions">

            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={3}>
                    <Grid item onClick={likedata}>
                        <Button
                            value="like"
                            id={item.id + " LikeButton"}
                        >
                            Like
                        </Button>
                    </Grid>
                    <Grid item >
                        <Button id={item.id + " CmtButton"}>Comment </Button>
                    </Grid>
                    <Grid item onClick={deletedata}>
                        <Button id={item.id + " ShareButton"}>Share </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}