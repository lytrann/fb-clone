import SetBioModal from "./SetBioModal.jsx";
import React from "react";
import BorderColorIcon from '@mui/icons-material/BorderColor';

export default function EditBioOptions(props) {
    const Bio = props.Bio
    const showEditBio = props.showEditBio
    const [openBioModal, setOpenBioModal] = props.useOpenBioModal

    const handleOpenBioModal = () => setOpenBioModal(true);
    const handleCloseBioModal = () => setOpenBioModal(false);
    return (<div className={'float-right mr-1'} style={{'marginTop': '-30px'}}>
        {showEditBio ? <div>
            <p>{Bio}</p>
            <button className={'bg-gray-500/50'}>
                <BorderColorIcon style={{'fontSize': 'small'}}/> change bio
            </button>

        </div> : <div>
            <button onClick={handleOpenBioModal} className={'bg-gray-500/50'}><BorderColorIcon
                style={{'fontSize': 'small'}}/> set bio
            </button>
            <SetBioModal openBioModal={openBioModal}
                         handleCloseBioModal={handleCloseBioModal}/>
        </div>}
    </div>)
}