
import React, { useState } from 'react';
import './Upload.css';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateProfile } from '../../store/auth';
import './ProfileImgUpload.css';
import NavBar from '../NavBar/NavBar';

const ProfileImgUpload = () => {


    const [photoFile, setPhotoFile] = useState(null);
    const userId = useSelector(state => state.auth.id);
    const history = useHistory();
    const dispatch = useDispatch();
    const [imgPreview, setImgPreview] = useState(null)

    const handleChange = (e) => {
        setPhotoFile(e.target.files[0])
        setImgPreview(URL.createObjectURL(e.target.files[0]))
    }

    const postPhoto = async (formData) => {
        dispatch(updateProfile(formData))
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", photoFile)
        await postPhoto(formData)

        setTimeout(() => {
            history.push(`/my/profile/${userId}`)

        }, 1000)
    }
    return (
        <>
            <NavBar />
            <div className='upload'>
                <div className='upload-img-preview'>
                    {imgPreview ?
                        <img src={imgPreview} className='uplaod-img-preview__img' alt='Not Found' />
                        :
                        <p>Upload Photo</p>

                    }
                </div>

                <form className='upload-form' onSubmit={handleSubmit}>

                    <p>Select a photo to upload</p>
                    <input
                        className='upload-form__input'
                        onChange={handleChange}
                        type='file'
                        name='file'
                    />
                    <div className='upload-form__btn-div'>
                        <button className='upload-form__btn'>Upload</button>
                    </div>
                </form>
            </div>
        </>
    )

}

export default ProfileImgUpload
