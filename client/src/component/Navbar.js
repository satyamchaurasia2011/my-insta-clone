import {React, useContext, useRef, useEffect, useState} from 'react'
import { Link, useHistory } from "react-router-dom";
import { UserContext } from '../App';
import M from 'materialize-css'
const Navbar = () => {
  const searchModal = useRef(null)
  const [search, setSearch] = useState("");
  const [findUser, setFindUser] = useState([]);
  const history = useHistory()
  useEffect(() => {
    M.Modal.init(searchModal.current)
  },[])
  const {state, dispatch} = useContext(UserContext);
  const renderList = () => {
    if(state){
        return [
          <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
          <li key="2"><Link to="/profile">Profile</Link></li>,
          <li key="3"><Link to="/createpost">Create Post</Link></li>,
          <li key="4"><Link to="/myfollowingpost">My following posts</Link></li>,
          <li key="5">
          <button 
          onClick = {() => {
            localStorage.clear()
            dispatch({type : "CLEAR"})
            history.push('/signin');
          }} 
          className="btn #e53935 red darken-1">Logout
           </button>
          </li>
        ]
    }else{
      return [
        <li key="6"><Link to="/signin">SignIn</Link></li>,
        <li key="7"><Link to="/signup">SignUp</Link></li>
      ]
    }
  }
  const searchUser = (query) => {
    setSearch(query)
    fetch('/search-user', {
      method : "post",
      headers: {
        "Content-Type" : "application/json"
    },
      body : JSON.stringify({
        query
      })
   }).then(res => res.json())
   .then(result => {
     setFindUser(result.user);
   })
  }
    return (
        <div>
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
           {renderList()}
          </ul>
        </div>
        <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          <input 
                type = "text"
                placeholder = "search user" 
                value = {search}
                onChange = {(event) => searchUser(event.target.value)}
             />
                <ul className="collection">
                  {findUser.map(user=> {
                    return <Link to={user._id!==state._id?'/profile/'+user._id:'/profile'}
                    onClick = {() =>{
                      M.Modal.getInstance(searchModal.current).close()
                      setSearch('')
                    }}
                    >
                    <li key={user._id} className="collection-item">{user.email}</li></Link>
                  })}
                </ul>
          </div>
          <div className="modal-footer">
            <button onClick = {() =>searchUser('')} 
            className="modal-close waves-effect waves-green btn-flat">close</button>
          </div>
        </div>      
      </nav>
      </div>
            
    )
}
export default Navbar;