import {React, useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css';
import GoogleIcon from '@mui/icons-material/Google';
import GoogleLogin from 'react-google-login';
import { UserContext } from '../App';
import { signWithGoogle, userSignin } from '../services/api';
const Signin = () => {
   const {state, dispatch} = useContext(UserContext)
   const history = useHistory();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [visibile, setVisibile] = useState(false);
   const postData = (e) => {
      e.preventDefault();
      if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
         M.toast({html : "Invalid email!", classes:"#d32f2f red darken-2"})
      }
      else {
         userSignin(email,password)
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
     }
   }
   const successResponseGoogle = (res) => {
      console.log(res);
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
                placeholder = "email" 
                value = {email}
                onChange = {(event) => setEmail(event.target.value)}
             />
             <input 
                type = {visibile?"text":"password"}
                placeholder = "password" 
                value = {password}
                onChange = {(event) => setPassword(event.target.value)}
                style={{marginTop:'15px'}}
                />
                <i style={{left:"180px"}} 
                onClick = {()=>{setVisibile(prev => !prev)}}
                 className="material-icons visible">
                {visibile?"visibility" : "visibility_off" }
                </i> 
              <button  type='submit'
              className="sign-in btn waves-effect waves-light #1e88e5 blue darken-1">Sign In
              </button>
              </form>
              <h6>OR</h6>
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
              <p>
              <Link to="/reset">Forgot password?</Link> 
              </p>
           </div>
           <div className = "card auth-card-2 input-field">
             <p>
              <Link to="/signup">Don't have an account? <span>Sign up</span></Link> 
              </p>
           </div>
       </div>

    )
}

export default Signin
