import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
const Profile = () => {
    const [userProfile, setUserProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [isfollow, setIsFollow] = useState(state?state.following.includes(userid):false)
    
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setUserProfile(result)
            // setMyPic(result.mypost)
        })
    },[])

    const followUser = () => {
        fetch('/follow', {
            method:"put",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
               followId : userid
            })
        }).then(res => res.json())
        .then(result => {
          dispatch({type : 'UPDATE', payload:{following:result.following, followers:result.followers}})
          localStorage.setItem("user", JSON.stringify(result))
          setUserProfile(prevState => {
                return {
                    ...prevState,
                    user : {
                        ...prevState.user,
                        followers : [...prevState.user.followers, result._id]
                    }
                }
          })
        })
        .catch(err => {
            console.log(err);
        })
    }
    const unFollowUser = () => {
        fetch('/unfollow', {
            method:"put",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
               unfollowId : userid
            })
        }).then(res => res.json())
        .then(result => {
            dispatch({type : 'UPDATE', payload:{following:result.following, followers:result.followers}})
            localStorage.setItem("user", JSON.stringify(result))
            setUserProfile(prevState => {
                const newFollower = prevState.user.followers.filter(item => item !== result._id)
                return {
                    ...prevState,
                    user : {
                        ...prevState.user,
                        followers : newFollower
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
        })
    }
    return (
        <>
        {userProfile ? 
            <div style={{maxWidth:"750px", margin:"0px auto"}}>
            <div style = {{
                display : "flex",
                justifyContent : "space-evenly",
                margin : "18px 0px",
                borderBottom : "1px solid grey",
                paddingBottom : "10px",
                alignItems:'center'
             }}>
               <div>
                   <img className='pro-dp'
                   src={userProfile.user.pic}
                   alt="img"
                    />
               </div> 
               <div className='pro-right'>
                   <h4>{userProfile.user.name}</h4>
                   <h5>{userProfile.user.email}</h5>
                   <div style={{display:"flex", justifyContent : "space-between", width:"108%"}}>
                       <h6>{userProfile.posts.length} posts</h6>
                       <h6>{userProfile.user.followers.length} followers</h6>
                       <h6>{userProfile.user.following.length} following</h6>
                   </div>
                   <button style={{margin:"10px"}} 
                   onClick = {() => {
                       isfollow ? unFollowUser() : followUser()
                       setIsFollow(prev => !prev)
                    }}
              className="btn waves-effect waves-light #1e88e5 blue darken-1">{isfollow?"Unfollow" : "Follow"}
              {console.log(userProfile.user.followers.filter(id =>  {if(id === userid) return true; else return false} ))}
              </button>
               </div>
            </div>
            <div className="gallery">
            {
                userProfile.posts.map((item) => {
                    return (
                        <img key={item._id} className="item" src={item.photo} alt="img" />
                    )
                })
            }
            </div>
        </div>
        : <h2>loading....</h2>}
        
        </>
    )
}

export default Profile