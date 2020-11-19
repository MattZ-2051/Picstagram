import React, { useEffect, useState } from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import './UserData.css';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserData = ({ data }) => {

    const history = useHistory()
    const userId = useSelector(state => state.auth.id)

    const routeChange = () => {
        history.push(`/profile/${data.id}`)
    }

    return (
        <div className='user'>
            <div className='user__profileImg'>
                {data.profileImg ? <img src={data.profileImg} alt='Image not found' onClick={routeChange} /> : <AccountCircleIcon className='user__profileImg__default' onClick={routeChange} />}
            </div>
            <div className='user__username'>
                {data.username}
            </div>
        </div>
    )
}

export default UserData
