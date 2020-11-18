import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './ExplorePage.css';
import ExplorePagePost from './ExplorePagePost';

const ExplorePage = () => {


    const fetchWithCSRF = useSelector(state => state.auth.csrf)
    const [posts, setPosts] = useState(null)
    const user = useSelector(state => state.auth.id)

    useEffect(() => {
        async function fetchData() {
            const res = await fetchWithCSRF('api/post/explore/posts', {
                method: 'GET'
            })

            if (res.ok) {
                const data = await res.json()
                setPosts(data.posts)
            }
        }
        fetchData()
    }, [])

    if (posts === null) {
        return <h1>loading...</h1>
    }

    const allPosts = posts.map((item, index) => {
        if (item.userId !== user) {
            return (
                <div className='explore-page__post' key={index}>
                    <ExplorePagePost post={item} />
                </div>
            )
        }
    })

    return (
        <>
            <div className='explore-page'>
                {allPosts}
            </div>
        </>
    )
}

export default ExplorePage;
