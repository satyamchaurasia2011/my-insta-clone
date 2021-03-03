import {React, useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css';
import { UserContext } from '../../App';
const Signin = () => {
   const {state, dispatch} = useContext(UserContext)
   const history = useHistory();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [visibile, setVisibile] = useState(false);
   const postData = () => {
      if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
         M.toast({html : "Invalid email!", classes:"#d32f2f red darken-2"})
      }
      else {
      fetch("/signin", {
         method : "post",
         headers : {
            "Content-Type" : "application/json"
         },
         body : JSON.stringify({
            email,
            password
         })
      }).then(res => res.json())
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
    return (
       <div className="mycard">
           <div className = "card auth-card input-field">
           <h2>Instagram</h2>
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
                />
                <i style={{left:"200px"}} 
                onClick = {()=>{setVisibile(prev => !prev)}}
                 className="material-icons visible">
                {visibile?"visibility" : "visibility_off" }
                </i> 
              <button onClick = {postData}
              className="btn waves-effect waves-light #1e88e5 blue darken-1">Sign In
              </button>
              <h5>
              <Link to="/signup">Don't have an account?</Link> 
              </h5>
              <p>
              <Link to="/reset">Forgot password?</Link> 
              </p>
           </div>
       </div>

    )
}

export default Signin
