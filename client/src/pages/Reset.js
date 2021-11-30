import {React, useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css';
import { resetPassword } from '../services/api';
const Reset = () => {
   const history = useHistory();
   const [email, setEmail] = useState("");
   const postData = () => {
      if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
         M.toast({html : "Invalid email!", classes:"#d32f2f red darken-2"})
      }
      else {
      resetPassword(email)
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
              <button onClick = {postData}
              className="btn waves-effect waves-light #1e88e5 blue darken-1" style={{margin:'30px auto 30px'}}>Reset Password
              </button>
           </div>
       </div>

    )
}

export default Reset
