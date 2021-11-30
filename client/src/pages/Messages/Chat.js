import React, { useContext, useEffect, useRef, useState } from "react";
import "./Chat.css";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import UserInbox from "./UserInbox/UserInbox";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MessageThread from "./MessageThread/MessageThread";
import Send from "@mui/icons-material/Send";
import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { io } from "socket.io-client";
import { UserContext } from "../../App";
import { useHistory } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { contactList, getAllUser, getUserData, messageRoom, selectUser, sendMessage } from "../../services/api";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "none",
  boxShadow: 24,
  pb: 2,
};
function Chat() {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [leftShow, setLeftShow] = useState(true);
  const [rightShow, setRightShow] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [friend, setFriend] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if (window.screen.width < 600) setRightShow(false);
    socket.current = io.connect("https://insta-back.herokuapp.com/");
    socket.current.on("getMessage", (data) => {
     // console.log(data);
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(async() => {
    socket.current.emit("addUser", state?._id);
    await socket.current.on("getUsers", (onlineusers) => {
     // console.log(onlineusers);
      setOnlineUsers(onlineusers);
    });
  }, [state?._id]);

  useEffect(() => {
    contactList(state?._id).then((contact) => {
      setConversations(contact);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);
  //scrolling
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  useEffect(() => {
    messageRoom(currentChat?._id).then((msg) => setMessages(msg))
    .catch((err) => console.log(err));
    const friendId = currentChat?.members.find((m) => m !== state?._id);

    getUserData(friendId).then((data) => setFriend(data))
    .catch((err) => console.log(err));
      
  }, [currentChat]);

  useEffect(() => {
      getAllUser()
      .then((users) => setUsers(users));
  }, []);

  //submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage !== "") {
      const message = {
        sender: state?._id,
        text: newMessage,
        conversationId: currentChat._id,
      };

      const receiverId = currentChat.members.find(
        (member) => member !== state?._id
      );

      socket.current.emit("sendMessage", {
        senderId: state?._id,
        receiverId,
        text: newMessage,
      });
      
      sendMessage(message)
        .then((savemsg) => setMessages([...messages, savemsg]))
        .catch((err) => console.log(err));
      //   try {
      //     const savemsg = await sendMessage(message);
      //     setMessages([...messages, savemsg.data]);
      //   } catch (error) {
      //     console.log(error);
      //   }
      setNewMessage("");
    }
  };

  //add contact on left
  const addConvo = (user) => {
    console.log(user);
    selectUser(state,user)
      .then((convo) => setConversations([...conversations, convo]))
      .catch((err) => console.log(err));
  };

  return (
    <div className="inbox">
      <div
        className="msg-sec"
        style={{ display: `${leftShow ? "block" : "none"}` }}
      >
        <div className="msg-head">
          <h5>Messages</h5>
          <AddCircleOutlineOutlinedIcon
            onClick={handleOpen}
            style={{ fontSize: "27px", marginTop: "5px", cursor: "pointer" }}
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} className="box-mod">
              <h5>New Message</h5>
              <div>
                <p>Suggested</p>
                {users?.map((user) => {
                  //console.log(user.name)
                  if (user._id !== state?._id)
                    return (
                      <div
                        onClick={() => {
                          addConvo(user);
                          handleClose();
                        }}
                      >
                        <img src={user?.pic} alt />
                        <h5>{user?.name}</h5>
                      </div>
                    );
                })}
              </div>
            </Box>
          </Modal>
        </div>
        <div className="msg-list">
          {conversations.map((c) => {
            return (
              <div
                onClick={() => {
                  setCurrentChat(c);

                  if (window.screen.width < 1011) {
                    setLeftShow(false);
                    setRightShow(true);
                  }
                }}
              >
                <UserInbox conversation={c} onlineUsers={onlineUsers}/>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="chat-sec"
        style={{ display: `${rightShow ? "block" : "none"}` }}
      >
        {currentChat ? (
          <div className="convo">
            <div className="convo-head">
              <ArrowBackIcon
                onClick={() => {
                  setLeftShow(true);
                  setRightShow(false);
                }}
                style={{
                  marginRight: "15px",
                  marginLeft: "-10px",
                  fontSize: "27px",
                  cursor: "pointer",
                }}
                className='arrow-bck'
              />
              <img src={friend?.pic} alt />
              <h5 onClick={() => history.push(`/profile/${friend?._id}`)}>
                {friend?.name}
              </h5>
              <InfoOutlinedIcon
                style={{ marginLeft: "auto", fontSize: "27px" }}
              />
            </div>
            <div className="convo-main">
              <div>
                {messages?.map((m, index) => {
                  scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
                  return (
                    <div>
                      <MessageThread
                        message={m}
                        own={m.sender === state?._id}
                        id={index}
                        friend={friend}
                      />
                    </div>
                  );
                })}
                <div className="bottom-chat" ref={scrollRef}>
                  {" "}
                </div>
              </div>
            </div>

            <div className="send-msg">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                  placeholder="Message ..."
                />
                <button type="submit">
                  <Send />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="no-chat">
            <SendOutlinedIcon style={{ fontSize: "50px", width: "100%" }} />
            <h4>Your Messages</h4>
            <p>Send private photos and messages to a friend.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;  
