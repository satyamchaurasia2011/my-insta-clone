import {React, useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M  from "materialize-css";
const Signup = () => {
   const history = useHistory();
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [visibile, setVisibile] = useState(false);
   const [image, setImage] = useState("");
   const [url,setUrl] = useState(undefined);
   useEffect(() => {
      if(url){
         uploadData()
      }
   }, [url])
   const uploadPic = () => {
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "insta-clone")
      data.append("cloud_name", "dvbkfxikz")
      fetch("	https://api.cloudinary.com/v1_1/dvbkfxikz/image/upload", {
          method : "post",
          body : data
       }).then(res => res.json())
       .then(data => {
          setUrl(data.url)
       }).catch(err =>{
          console.log(err);
       })   
  }
  const uploadData = () => {
   if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html : "Invalid email!", classes:"#d32f2f red darken-2"})
   }
   else {
   fetch("/signup", {
      method : "post",
      headers : {
         "Content-Type" : "application/json"
      },
      body : JSON.stringify({
         name,
         email,
         password,
         pic:url
      })
   }).then(res => res.json())
   .then(data => {
      if(data.error){
         M.toast({html : data.error, classes:"#d32f2f red darken-2"})
      }
      else{
         M.toast({html : data.message, classes:"#66bb6a green lighten-1"})
         history.push('/signin');
      }
   }).catch(err =>{
      console.log(err);
   })
  }
  }
   const postData = () => {
     if(image){
        uploadPic()
     } else {
        uploadData()
     }
   }
    return (
        <div className="mycard">
        <div className = "card auth-card input-field">
        <h2>Instagram</h2>
        <input 
             type = "text"
             placeholder = "name" 
             value = {name}
             onChange ={ (event) => setName(event.target.value)}
          />
          <input 
             type = "text"
             placeholder = "email" 
             value = {email}
             onChange ={ (event) => setEmail(event.target.value)}
          />
          <input 
             type = {visibile?"text":"password"}
             placeholder = "password" 
             value = {password}
             onChange ={ (event) => setPassword(event.target.value)}
          />
           <i onClick = {()=>{setVisibile(prev => !prev)}}
                 className="material-icons visible">
                {visibile?"visibility" : "visibility_off" }
                </i> 
                <div className="file-field input-field">
                <div className="btn #1e88e5 blue darken-1">
                    <span>Upload pic</span>
                    <input type="file" onChange = {(event) => setImage(event.target.files[0]) }/>
                 </div>
                    <div className="file-path-wrapper">
                         <input className="file-path validate" type="text" />
                     </div>
            </div>
           <button onClick = {postData} 
            className="btn waves-effect waves-light #1e88e5 blue darken-1">Sign Up
           </button>
           <h5>
        <Link to="/signin">Already have an account ?</Link>
        </h5>
        </div>
    </div>
    )
}

export default Signup
