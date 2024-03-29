import {React, useState, useEffect, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import GoogleIcon from '@mui/icons-material/Google';
import GoogleLogin from 'react-google-login';
import M  from "materialize-css";
import { UserContext } from '../App';
import { signWithGoogle, userSignup } from '../services/api';
const Signup = () => {
   const {state, dispatch} = useContext(UserContext)
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
   userSignup({name,email,password,url})
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
   const postData = (e) => {
      e.preventDefault();
     if(image){
        uploadPic()
     } else {
        uploadData()
     }
   }
   const successResponseGoogle = (res) => {
      //console.log(res);
      signWithGoogle(res)
      .then(data => {
         if(data.error){
            M.toast({html : data.error, classes:"#d32f2f red darken-2"})
         }
         else{
            localStorage.setItem("jwt", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            dispatch({type : "USER", payload : data.user})
            M.toast({html : "Successfully Signed in", classes:"#66bb6a green lighten-1"})
            history.push('/');
         }
      }).catch(err =>{
         console.log(err);
      })
      ;

   }
   const failureResponseGoogle = (res) => {
      console.log(res);
   }
    return (
        <div className="mycard">
        <div className = "card auth-card input-field">
        <h2>Instagram</h2>
        <form onSubmit={postData}>
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
           <button type='submit' 
            className="sign-in btn waves-effect waves-light #1e88e5 blue darken-1">Sign Up
           </button>
           </form>
           <p>OR</p>
           <GoogleLogin
               clientId="803835066549-eukhrbnee2bhb3ff5apbgf5fbed1m8bj.apps.googleusercontent.com"
               render={renderProps => (
                  <p onClick={renderProps.onClick} className='google'><GoogleIcon style={{color:'red',marginRight:'5px'}}/> Login with Google</p>
               )}
               buttonText="Login"
               onSuccess={successResponseGoogle}
               onFailure={failureResponseGoogle}
               cookiePolicy={'single_host_origin'}
            />
             
            
        </div>
        <div className = "card auth-card-2 input-field">
             <p>
              <Link to="/signin">Have an account ? <span>Sign in</span></Link> 
              </p>
           </div>
    </div>
    )
}

export default Signup
