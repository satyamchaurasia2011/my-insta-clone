import {React, useState, useContext} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css';
import { setNewPassword } from '../services/api';
const NewPassword = () => {
   const history = useHistory();
   const [password, setPassword] = useState("");
   const [visibile, setVisibile] = useState(false);
   const {token} = useParams();
   const postData = () => {
      setNewPassword({password, token})
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
    return (
       <div className="mycard">
           <div className = "card auth-card input-field">
           <h2>Instagram</h2>
             <input 
                type = {visibile?"text":"password"}
                placeholder = "password" 
                value = {password}
                onChange = {(event) => setPassword(event.target.value)}
                />
                <i style={{left:"230px"}} 
                onClick = {()=>{setVisibile(prev => !prev)}}
                 className="material-icons visible">
                {visibile?"visibility" : "visibility_off" }
                </i> 
              <button onClick = {postData}
              className="btn waves-effect waves-light #1e88e5 blue darken-1">Update Password
              </button>
           </div>
       </div>

    )
}

export default NewPassword
