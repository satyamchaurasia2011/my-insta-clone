import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../../App";
import M from 'materialize-css';
import { Link } from "react-router-dom";
const Home = () => {
    const [data, setData] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const [read, setRead] = useState(false)
    useEffect(() =>{
        fetch('/subscribedpost', {
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            // console.log(result);
             setData(result.posts)
             console.log(data);
        })
    },[])
    const likePost = (id) => {
        fetch('/like', {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }, 
            body : JSON.stringify({
                postId : id
            })
        }).then(res => res.json())
        .then(result => {
            // console.log(result);
            const newData = data.map(item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=> {
            console.log(err);
        })
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }, 
            body : JSON.stringify({
                postId : id
            })
        }).then(res => res.json())
        .then(result => {
            // console.log(result);
            const newData = data.map(item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err);
        })
    }
    const commentPost =(text, postId) => {
        fetch('/comment', {
            method:"put",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
        .then(result => {
            //  console.log(result);
            const newData = data.map(item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err);
        })
    }
   const commentsPost = (comm) => {
        return (
            comm.comments.map(record => {
                return (
                   <h6 key={record._id}><span style={{fontWeight:"700"}}><Link to={record.postedBy._id !== state._id?'/profile/'+record.postedBy._id : "/profile"}>
                   {record.postedBy.name}</Link>
                      </span> {record.text}  {record.postedBy._id == state._id && 
                    <i style={{float:"right"}} onClick={() => deleteComment(comm._id, record._id)} className="material-icons">
                    delete
                    </i>}</h6>
                )
            })
        )
    }
    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method : "delete",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res =>res.json())
        .then(result => {
            // console.log(result);
            const newData = data.filter(item => {
                return item._id !== result._id
            })
            setData(newData)
            M.toast({html : "Successfully deleted post", classes:"#66bb6a green lighten-1"})
        })
    }
    const deleteComment = (postId,commentid) => {
        fetch(`/deletecomment/${postId}`, {
            method : "delete",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ commentid })
        }).then(res =>res.json())
        .then(result => {
        //  console.log(result);
         const newData = data.map(item => {
            if(item._id === result._id){
                return result
            }else{
                return item
            }
        })
            setData(newData);
        })
    }
    return (
        <>
        {
            data ? 
            <div className="home">
                {data.length===0 && <h1>No Post To Show</h1>}
               { data.map(item => {
                    return (
                      <div className="card home-card" key = {item._id}>
                          <div className ='post-head'>
                            <div>
                             <img className ="himg" 
                            src={item.postedBy.pic}
                            alt="img"
                           />
                          </div> 
                        <div className='post-by'>
                            <h5 style={{padding : "5px"}}><Link style={{position: "relative",top: "-2px"}}
                             to={item.postedBy._id !== state._id?'/profile/'+item.postedBy._id : "/profile"}>
                                {item.postedBy.name}</Link>
                            </h5>
                        </div>
                        <div className='delete-i'>
                         {item.postedBy._id === state._id && 
                                <i style={{fontSize:'30px'}} onClick={()=>deletePost(item._id)} className="material-icons">
                                delete
                                </i>}
                        </div>
                        </div>
                        <div className="card-image">
                         <img
                         src={item.photo}
                         alt="wall"
                          />
                         </div>
                         <div className="card-content">
                         {item.likes.includes(state._id)
                         ? <i onClick={()=>unlikePost(item._id)} className="material-icons"
                         style={{color:"red"}}>favorite
                         </i>:
                         <i onClick={()=>likePost(item._id)} className="material-icons">
                         favorite_border
                         </i>
                         }
                         <h6>{item.likes.length} likes</h6>
                         <h6>{item.title}</h6>
                         <p>{item.body}</p>
                         {
                            (item.comments.length<3)?
                            commentsPost(item)
                             :
                            ( read?
                                commentsPost(item)
                                :
                             <div>
                             <h6 key={item.comments[0]._id}><span style={{fontWeight:"700"}}><Link to={item.postedBy._id !== state._id?'/profile/'+item.postedBy._id : "/profile"}>
                             {item.comments[0].postedBy.name}</Link></span> {item.comments[0].text}
                             {item.comments[0].postedBy._id == state._id && 
                        <i onClick={() => deleteComment(item._id,item.comments[0]._id)} style={{float:"right"}} className="material-icons">
                        delete
                        </i>}
                             </h6>
                             <h6 key={item.comments[1]._id}><span style={{fontWeight:"700"}}><Link to={item.postedBy._id !== state._id?'/profile/'+item.postedBy._id : "/profile"}>
                             {item.comments[1].postedBy.name}</Link></span> {item.comments[1].text}
                             {item.comments[1].postedBy._id == state._id && 
                        <i onClick={() => deleteComment(item._id,item.comments[1]._id)} style={{float:"right"}} className="material-icons">
                        delete
                        </i>}
                             </h6>
                             <a 
                             onClick = {()=>{setRead(prev => !prev)
                                }}
                             className="waves-effect waves-teal btn-flat read">
                                 View all {item.comments.length} comments
                                 </a>
                             </div>
                            )
                         }
                        
                         <form onSubmit = {(event) => {
                             event.preventDefault()
                             commentPost(event.target[0].value, item._id)
                             event.target[0].value=null
                             setRead(prev => true)
                         }}>
                         <input type="text" placeholder="add comment"/>
                         </form>
                        
                         </div> 
                     </div>
                    )
                })
            }
                
            </div>
            : 
            <h2>loading...!</h2>
        }
      
        </>
    );
}

export default Home
