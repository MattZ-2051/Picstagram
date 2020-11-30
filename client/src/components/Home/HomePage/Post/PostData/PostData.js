import React, { useEffect, useState } from 'react';
import './PostData.css';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CommentData from '../CommentData/CommentData';
import CommentUserInfo from '../CommentUserInfo/CommentUserInfo';
import { makeStyles } from '@material-ui/core/styles';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';


const useStyles = makeStyles((theme) => ({
    likeTrue: {
        fill: '#1DB954',
        paddingRight: '30px',
        marginRight: '5px',
        fontSize: '28px',
        paddingTop: '5px',
        '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.1)'
        }
    },
    likeNone: {
        fill: '#191414',
        paddingRight: '30px',
        marginRight: '5px',
        fontSize: '28px',
        paddingTop: '5px',
        '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.1)'
        }
    }
}));

const PostData = ({ data }) => {

    const classes = useStyles();
    const [comment, setComment] = useState('')
    const userId = useSelector(state => state.auth.id);
    const fetchWithCSRF = useSelector(state => state.auth.csrf);
    const [commentsData, setCommentsData] = useState();
    const [commentUser, setCommentUser] = useState();
    const [hidden, setHidden] = useState(true)
    const history = useHistory()
    const [favorited, setFavorited] = useState(false)
    const [changeIcon, setChangeIcon] = useState(false)
    const [commentHidden, setCommentHidden] = useState(true)


    const newComment = async () => {
        const res = await fetchWithCSRF(`/api/post/${data.id}/${userId}/${1}/comment`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comment)
        })
        if (res.ok) {
            const data = await res.json()
            setCommentUser([...commentUser, data.user])
            setCommentsData([...commentsData, data.comment])
        }
        return
    }

    const favorite = async () => {

        if (favorited === false) {
            const res = await fetchWithCSRF(`/api/post/${data.id}/${userId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.ok) {
                const data = await res.json()
            }
        } else {
            const res = await fetchWithCSRF(`/api/post/${data.id}/${userId}/like`, {
                method: 'DELETE',
            })

            if (res.ok) {
                const data = await res.json();
            }
        }
    }

    useEffect(() => {
        if (userId === data.userId) {
            setCommentHidden(false)
        }
    }, [])

    const handleComment = (e) => {
        e.preventDefault()
        newComment()
        setComment('')
    }

    useEffect(() => {
        async function fetchData() {
            const res = await fetchWithCSRF(`/api/post/${data.id}/post/comments`, {
                methods: 'GET'
            })
            if (res.ok) {
                const data = await res.json()
                setCommentsData(data.comments)
                setCommentUser(data.userInfo)
            }
        }

        async function fetchLikes() {
            const res = await fetchWithCSRF(`/api/post/${data.id}/${userId}/like`, {
                method: 'GET',
            })

            if (res.ok) {
                const data = await res.json()

                if (data.like === true) {
                    setChangeIcon(true)
                    setFavorited(true)

                } else {
                    setChangeIcon(false)
                    setFavorited(false)
                }
            }

        }

        fetchData()

        fetchLikes()

    }, [])

    const commentViewChange = () => {
        if (hidden === true) {
            setHidden(false)
        } else {
            setHidden(true)
        }
    }

    const handleDelete = (e) => {
        e.preventDefault()
        deleteComment(e.target.id)
    }

    const deleteComment = async (commentId) => {
        const res = await fetchWithCSRF(`/api/post/${data.id}/${userId}/${commentId}/comment`, {
            method: 'DELETE'
        })
        if (res.ok) {
            const data = await res.json()
            console.log(data)
            setCommentUser([...commentUser, data.userInfo])
            setCommentsData([...commentsData, data.comments])
        }
    }


    const routeChange = () => {
        history.push(`/post/${data.id}`)
    }

    const handleFavorite = () => {
        favorite()
        if (favorited === false) {
            setChangeIcon(true)
            setFavorited(true)
        } else {
            setFavorited(false)
            setChangeIcon(false)
        }
    }

    if (commentsData === undefined || commentUser === undefined) {
        return <h1>loading...</h1>
    }


    console.log(commentUser)
    console.log(commentsData)
    return (
        <div className='postData'>
            <img src={data.img} alt='Image could not be found' onClick={routeChange} />
            <div className='postData__caption'>
                {changeIcon
                    ? <SentimentVerySatisfiedIcon className='postData__star' className={favorited ? classes.likeTrue : classes.likeNone} onClick={handleFavorite} />
                    :
                    <SentimentSatisfiedIcon className='postData__star' className={favorited ? classes.likeTrue : classes.likeNone} onClick={handleFavorite} />
                }
                <div className='postData__caption__data'>
                    {data.caption}
                </div>
            </div>
            <button className='viewCommentBtn' onClick={commentViewChange} hidden={!hidden}>View all {commentsData.length} comments</button>
            <button className='closeCommentBtn' onClick={commentViewChange} hidden={hidden}>Close Comments</button>
            <div hidden={hidden}>
                <div className='comment' >
                    {commentsData.map((item, index) => {
                        return (
                            <div key={index} className='post__comment'>
                                <CommentUserInfo data={commentUser[commentsData.length - (index + 1)]} />
                                <CommentData data={commentsData[commentsData.length - (index + 1)]} />
                                <div className='comments-deleteBtn'>
                                    <button type='submit' id={commentsData[commentsData.length - (index + 1)]['id']} hidden={hidden} onClick={handleDelete}>Delete</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='comment-form-div'>
                    <form onSubmit={handleComment} className='comment-form'>
                        <input value={comment} className='post__comment__input' type='text' placeholder='Add a comment...' onChange={(e) => setComment(e.target.value)} />
                        <button type='submit' hidden={true} className='comment-btn'></button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostData
