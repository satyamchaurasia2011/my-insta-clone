import React from 'react'
import './MessageThread.css'
function MessageThread({message,own,friend}) {
    return (
        <div className='thread'>
            {
                own?(
                    <div className='outgoing'>
                        <div>
                        <p>{message.text}</p>
                        </div>
                    </div>
                ):(
                    <div className='incoming'>
                        <div>
                        <img src={friend?.pic} alt/>
                        <div>
                            <p>{message.text}</p>
                        </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default MessageThread
