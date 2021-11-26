import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../../App';
import './UserInbox.css'
function UserInbox({conversation, onlineUsers}) {
    const [user, setUser] = useState(null);
    const {state, dispatch} = useContext(UserContext);
    const [online, setOnline] = useState(null);
    useEffect(async () => {
        const friendId = await conversation.members.find((m) => m !== state?._id);
        console.log(onlineUsers);
        setOnline(onlineUsers.find(user => user.userId === friendId));
        fetch("/getuser/" + friendId , {
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
