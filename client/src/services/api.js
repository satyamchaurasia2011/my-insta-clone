let server = "https://insta-back.herokuapp.com";

////Sign-In////////////
export const userSignin =async(email,password) => {
    return await  fetch(server + "/signin", {
        method : "post",
        headers : {
           "Content-Type" : "application/json"
        },
        body : JSON.stringify({
           email,
           password
        })
     }).then(res => res.json())
}

///////////Signup /////////////////
export const userSignup = async(data) => {
    return await fetch(server + "/signup", {
        method : "post",
        headers : {
           "Content-Type" : "application/json"
        },
        body : JSON.stringify({
           name : data.name,
           email : data.email,
           password : data.password,
           pic : data.url
        })
     }).then(res => res.json())
}

/////Signup with GOOGLE  //////////////
export const signWithGoogle = async(res) => {
   return await fetch(server + '/signupwithgoogle' , {
         method : "post",
         headers : {
            "Content-Type" : "application/json"
         },
         body : JSON.stringify({
           tokenId : res.tokenId
         })
      }).then(res => res.json())

}

//////////get user with their post////
export const getUserProfile = async(id) => {
    return await fetch(server + `/user/${id}`, {
        headers : {
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        }
    }).then(res => res.json())
}



//Search User
export const searchUser = async (query) => {
   return await fetch(server + "/search-user", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
}

////Create Post///////
export const createPost = async (data) => {
    return await fetch(server + "/createpost", {
        method : "post",
        headers : {
           "Content-Type" : "application/json",
           "Authorization" : "Bearer " + localStorage.getItem("jwt")
        },
        body : JSON.stringify({
           title : data.title,
           body : data.body,
           pic : data.url
        })
     }).then(res => res.json())
}

////////Follow ///
export const userFollow = async(id) => {
    return await  fetch(server + '/follow', {
        method:"put",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        },
        body : JSON.stringify({
           followId : id
        })
    }).then(res => res.json())
}
///////Unfollow//////
export const userUnfollow = async(id) => {
    return await  fetch(server + '/unfollow', {
        method:"put",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        },
        body : JSON.stringify({
           unfollowId : id
        })
    }).then(res => res.json())
}


////show posts///
export const allPosts = async() => {
    return await fetch(server + '/posts', {
        headers : {
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        }
    }).then(res => res.json())
}


//////Subscribed Post///////////////
export const subscribedPosts = async() => {
    return await  fetch(server + '/subscribedpost', {
        headers : {
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        }
    }).then(res => res.json())
}



////like a post ///
export const postLike = async(id) => {
    return await  fetch(server + '/like', {
        method : "put",
        headers : {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        }, 
        body : JSON.stringify({
            postId : id
        })
    }).then(res => res.json())
}
/////unlike a post
export const postUnlike = async(id) => {
    return await fetch(server + '/unlike', {
        method : "put",
        headers : {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        }, 
        body : JSON.stringify({
            postId : id
        })
    }).then(res => res.json())
}
/////Comment on post ....//
export const postComment = async(text, postId) => {
    return await  fetch(server + '/comment', {
        method:"put",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        },
        body : JSON.stringify({
            postId,
            text
        })
    }).then(res => res.json())
}
///delete a post //////////
export const removePost = async(id) => {
    return await  fetch(server + `/deletepost/${id}`, {
        method : "delete",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        }
    }).then(res =>res.json())
}
/////delete a comment ///////////
export const removeComment = async(postId, commentid) => {
    return await fetch(server + `/deletecomment/${postId}`, {
        method : "delete",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({ commentid })
    }).then(res =>res.json())
}

///reset password///////
export const resetPassword = async(email) => {
   return await fetch(server + "/reset-password", {
         method : "post",
         headers : {
            "Content-Type" : "application/json"
         },
         body : JSON.stringify({
            email
         })
      }).then(res => res.json())
}
///New Password //////
export const setNewPassword = async(data) => {
    return await fetch(server + "/new-password", {
        method : "post",
        headers : {
           "Content-Type" : "application/json"
        },
        body : JSON.stringify({
           password : data.password,
           token : data.token
        })
     }).then(res => res.json())
}

////My - post
export const getMyPost = async() => {
    return await fetch(server + '/mypost', {
        headers : {
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        }
    }).then(res => res.json())
}

////Update pic///////
export const updateProfilePic = async(url) => {
    return await fetch(server + '/updatepic', {
        method : "put",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
        },
        body : JSON.stringify({
           pic : url
        })
    }).then(res => res.json())
}

///////////////////////////////Message section//////////////////
//Contacts list
export const contactList = async (id) => {
   return await fetch(server + `/conversation/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
}

//chats with a particular person
export const messageRoom = async (id) => {
    return await fetch(server + `/messages/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
}

//get user data by their id
export const getUserData = async (id) => {
    return await fetch(server + `/getuser/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
}

//get all users data
export const getAllUser = async () => {
    return await fetch(server + "/alluser", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
}

//send message on chat
export const sendMessage = async (message) => {
    return await fetch(server + "/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify(message),
      })
        .then((res) => res.json())
}

//making a room by selecting a user
export const selectUser = async (state,user) => {
    return await fetch(server + "/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ senderId: state?._id, receiverId: user._id }),
      })
        .then((res) => res.json())
}