import {Menu, MenuItem, Modal, Paper, Container} from "@mui/material";
import React, {useEffect, useState} from "react";

export default function EditBannerMenu(props) {

    const anchorBanner = props.AnchorBanner;
    const BannerPic = props.BannerPic;
    const BannerPicName = props.BannerPicName;
    const BannerMenuHandleClose = props.BannerMenuHandleClose;
    const openBanner = props.openBanner;
    const person = localStorage.getItem("user");
    const sid = localStorage.getItem("sessionID");
    const user = props.user;
    const [showEdit, setshowEdit] = useState(true);
    const pictype = props.pictype;
    const showDeleteBanner = props.showDeleteBanner;

    useEffect(() => {
        if (person !== user) {
            setshowEdit(!showEdit)
        } else {
            null
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
            await fetch(`http://localhost:8080/editpic?type=${pictype}&sid=${sid}`,
                {method: "POST", body: formData});
        const response = await rawResponse.json();
        if (response === 'updated') {
            await window.location.reload();
        } else {
            alert(response);
        }
    }

    async function handleDelete(event) {
        event.preventDefault();
        const rawResponse =
            await fetch(`http://localhost:8080/deletepic?pic=${BannerPicName}&sid=${sid}`,
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
        <Menu
            id="pic-menu"
            anchorEl={anchorBanner}
            open={openBanner}
            onClose={BannerMenuHandleClose}
            MenuListProps={{'aria-labelledby': 'pic'}}>
            <MenuItem onClick={ViewModalHandleOpen}>view</MenuItem>
            <Modal
                   open={OpenViewModal}
                   onClose={ViewModalHandleClose}
                   aria-labelledby="view-pic">
                    <Paper elevation={3}
                style={{'margin-top': '10%'}}>
                    <img id="view-pic" src={BannerPic}
                         style={{
                             'width': '80%',
                             'height': '400px',
                             'objectFit': 'none'
                         }}>

                    </img>
                </Paper>

            </Modal>
            {showEdit ?
                <div>
                    <MenuItem onClick={EditModalHandleOpen}>edit</MenuItem>
                    <Modal
                           open={OpenEditModal}
                           onClose={EditModalHandleClose}
                           aria-labelledby="edit-pic">

                        <Paper elevation={3}
                        style={{'margin-top': '10%'}}>
                            {selectedImage && (
                                <div>
                                    <img alt="not found" src={URL.createObjectURL(selectedImage)} style={{
                                        'width': '80%', 'height': '300px', 'objectFit': 'cover'
                                    }}/>
                                    <br/>
                                    <button onClick={() => setSelectedImage(null)}>remove</button>
                                    <br/>
                                    <button type="submit" onClick={handleEdit}>save change</button>
                                </div>)}
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
            {showDeleteBanner ?
                <MenuItem onClick={handleDelete}>delete</MenuItem>
                : undefined}
        </Menu>
    );
}