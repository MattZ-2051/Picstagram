import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CommentData from './CommentData/CommentData';
import CommentUserInfo from './CommentUserInfo/CommentUserInfo';
import './Post.css'
import PostData from './PostData/PostData';
import UserData from './UserData/UserData';

const Post = ({ data }) => {

    console.log(data)

    return (
        <>
            {data.posts.map((item, index) => {
                return <div className='post'>
                    <UserData data={data.userInfo[index]} key={index} />
                    <PostData data={item} key={index} />
                    <CommentUserInfo data={data.postCommentUserInfo[index]} key={index} />
                    <CommentData data={data.postComments[index]} key={index} />

                </div>
            })}
        </>
    )
}

export default Post;