import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../../App';
import './UserInbox.css'
const socket = useRef();
import { io } from "socket.io-client";
function UserInbox({conversation}) {
    const [user, setUser] = useState(null);
    const {state, dispatch} = useContext(UserContext);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [online, setOnline] = useState(null);
    useEffect(() => {
        socket.current.on("getUsers", (onlineusers) => {
         // console.log(onlineusers);
          setOnlineUsers(onlineusers);
        });
      }, [state?._id]);
    useEffect(async () => {
        const friendId = await conversation.members.find((m) => m !== state?._id);
        console.log(onlineUsers);
        setOnline(onlineUsers.find(user => user.userId === friendId));
        fetch("https://insta-back.herokuapp.com/getuser/" + friendId , {
            headers : {
              "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
          }).then(res => res.json())
          .then(data => setUser(data))
          .catch(err => console.log(err));
      }, [conversation, state?._id]);
    return (
        <div className='user-inbox'>
           {online && <div className='online'></div>}
                <img src={user?.pic}/>
            <div>
                <h6>{user?.name}</h6>
            </div>
        </div>
    )
}

export default UserInbox
