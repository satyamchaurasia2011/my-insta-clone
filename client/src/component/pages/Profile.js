import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from "../../App";
const Profile = () => {
    const [myprofile, setMyProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("");
    useEffect(() => {
        fetch('https://insta-back.herokuapp.com/mypost', {
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setMyProfile(result.mypost)
        })
    },[])
    useEffect(() => {
        if(image){
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "insta-clone")
            data.append("cloud_name", "dvbkfxikz")
            fetch("	https://api.cloudinary.com/v1_1/dvbkfxikz/image/upload", {
                method : "post",
                body : data
             }).then(res => res.json())
             .then(data => {
                
                fetch('https://insta-back.herokuapp.com/updatepic', {
                    method : "put",
                    headers: {
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer " + localStorage.getItem("jwt")
                    },
                    body : JSON.stringify({
                       pic : data.url
                    })
                }).then(res => res.json())
                    .then(result => {
                         localStorage.setItem("user", JSON.stringify({...state,pic:result.pic}))
                         dispatch({type:"UPDATEPIC", payload:result.pic})
                         document.getElementById('empty').value=null
                    })
             }).catch(err =>{
                console.log(err);
             }) 
         
        }
    },[image])
    const updatePhoto = (file) => {
        setImage(file)
    }
    return (
        <>
       { myprofile ? 
        <div style={{maxWidth:"950px", margin:"0px auto"}}>
        <div style = {{
            margin : "38px 0px",
            borderBottom : "1px solid grey",
            paddingBottom : "10px"
         }}>
             <div style = {{
            display : "flex",
            justifyContent : "space-evenly",
            alignItems:'center'
         }}>
           <div>
               <img  className='pro-dp'
               src={state.pic}
               alt="img"
                />
           </div> 
           <div className='pro-right' style={{marginTop:'-20px'}}>
               <h4>{state.name}</h4>
               <h5>{state.email}</h5>
               <div style={{display:"flex", justifyContent : "space-between", width:"108%"}}>
                   <h6>{myprofile.length} posts</h6>
                   <h6>{state.followers.length} followers</h6>
                   <h6>{state.following.length} following</h6>
               </div>
           </div>
        </div>
        <div className="file-field input-field" style={{margin:"10px 10px 10px 15%",width:'50%'}}>
                <div className="btn #1e88e5 blue darken-1">
                    <span>Update pic</span>
                    <input type="file" onChange = {(event) => updatePhoto(event.target.files[0]) }/>
                 </div>
                    <div className="file-path-wrapper">
                         <input className="file-path validate" id="empty" type="text" />
                     </div>
            </div>
           </div>
        <div className="gallery">
        {
            myprofile.map((item) => {
                return (
                    <img key={item._id} className="item" src={item.photo} alt="img" />
                )
            })
        }
        </div>
    </div>
       :
        <h2>loading....</h2>}
        </>
    )
}

export default Profile
