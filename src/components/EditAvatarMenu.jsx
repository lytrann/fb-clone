import {Menu, MenuItem, Modal, Paper} from "@mui/material";
import React, {useEffect, useState} from "react";

export default function EditAvatarMenu(props) {

    const anchorAva = props.AnchorAva;
    const ProfilePic = props.ProfilePic;
    const ProfilePicName = props.ProfilePicName;
    const AvaMenuHandleClose = props.AvaMenuHandleClose;
    const openAva = props.openAva;
    const person = localStorage.getItem("user");
    const sid = localStorage.getItem("sessionID");
    const user = props.user;
    const [showEdit, setshowEdit] = useState(true);
    const pictype = props.pictype;
    const showDeleteAva = props.showDeleteAva;

    useEffect(() => {
        if (person !== user) {
            setshowEdit(!showEdit);
        } else {
            null;
        }
    }, [])


    const [OpenViewModal, setOpenViewModal] = useState(false);
    const ViewModalHandleOpen = () => setOpenViewModal(true);
    const ViewModalHandleClose = () => setOpenViewModal(false);

    const [OpenEditModal, setOpenEditModal] = useState(false);
    const EditModalHandleOpen = () => setOpenEditModal(true);
    const EditModalHandleClose = () => {
        setSelectedImage(null);
        setOpenEditModal(false);
    };
    const [selectedImage, setSelectedImage] = useState(null);

    async function handleEdit(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append(`${person}-${pictype}`, selectedImage);
        const rawResponse =
            await fetch(`https://lytran-api.deepsel.com/editpic?type=${pictype}&sid=${sid}`,
            {method: "POST", body: formData});
        const response = await rawResponse.json();
        await console.log(response);
        if (response === 'updated') {
            await window.location.reload();
        } else {
            alert(response);
        }
    }

    async function handleDelete(event) {
        event.preventDefault();
        const rawResponse = await fetch(
            `https://lytran-api.deepsel.com/deletepic?pic=${ProfilePicName}&sid=${sid}`,
            {method: "POST", body: null});
        const response = await rawResponse.json();
        await console.log(response);
        if (response === 'deleted') {
            await window.location.reload();
        } else {
            alert(response);
        }
    }

    return (
        <Menu id="pic-menu"
              anchorEl={anchorAva}
              open={openAva}
              onClose={AvaMenuHandleClose}
              MenuListProps={{'aria-labelledby': 'pic'}}>
            <MenuItem onClick={ViewModalHandleOpen}>view</MenuItem>
            <Modal
                open={OpenViewModal}
                onClose={ViewModalHandleClose}
                aria-labelledby="view-pic">
                <Paper elevation={3}>
                    <img id="view-pic" src={ProfilePic}
                         style={{
                             'width': '500px', 'height': '500px', 'objectFit': 'none'
                         }}
                    ></img>
                </Paper>
            </Modal>
            {showEdit ?
                <div>
                <MenuItem onClick={EditModalHandleOpen}>edit</MenuItem>
                <Modal
                    open={OpenEditModal}
                    onClose={EditModalHandleClose}
                    aria-labelledby="edit-pic">
                    <Paper elevation={3}>
                        {selectedImage && (<div>
                            <img alt="not found" src={URL.createObjectURL(selectedImage)} style={{
                                'width': "200px", 'height': "200px", 'objectFit': 'cover'
                            }}/>
                            <br/>
                            <button onClick={() => setSelectedImage(null)}>remove</button>
                            <br/>
                            <button type="submit" onClick={handleEdit}>save change</button>
                        </div>)}
                        <br/>
                        <br/>
                        <form method='Post' encType="multipart/form-data">
                            <input
                                type="file"
                                name={"hi"}
                                accept="image/*"
                                onChange={(event) => {
                                    console.log(event.target.files[0]);
                                    setSelectedImage(event.target.files[0]);
                                }}>

                            </input>
                        </form>
                    </Paper>
                </Modal>
            </div>
                : undefined}
            {showDeleteAva ?
                <MenuItem onClick={handleDelete}>delete</MenuItem>
                : undefined}
        </Menu>
    );
}