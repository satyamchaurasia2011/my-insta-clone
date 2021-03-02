import {React, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css';
const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const[body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url,setUrl] = useState("");
    useEffect(() => {
        if(url){
            fetch("http://localhost:3000/createpost", {
                method : "post",
                headers : {
                   "Content-Type" : "application/json",
                   "Authorization" : "Bearer " + localStorage.getItem("jwt")
                },
                body : JSON.stringify({
                   title,
                   body,
                   pic : url
                })
             }).then(res => res.json())
             .then(data => {
                if(data.error){
                   M.toast({html : data.error, classes:"#d32f2f red darken-2"})
                }
                else{
                   M.toast({html : "Posted...", classes:"#66bb6a green lighten-1"})
                   console.log(data);
                   history.push('/');
                }
             }).catch(err =>{
                console.log(err);
             })
            }
    }, [url])
    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "dvbkfxikz")
        fetch("	https://api.cloudinary.com/v1_1/dvbkfxikz/image/upload", {
            method : "post",
            body : data
         }).then(res => res.json())
         .then(data => {
            setUrl(data.url)
         }).catch(err =>{
            console.log(err);
         })   
    }
    return (
        <div className="card input-filed"
        style={{
            margin : "30px auto",
            maxWidth : "500px",
            padding : '20px',
            textAlign: "center"    
        }}>
            <input 
            type="text" 
            placeholder="title" 
            value={title}  
            onChange={(event) => setTitle(event.target.value)}    
            />
            <input 
            type ="text" 
            placeholder="body"
            value={body}  
            onChange={(event) => setBody(event.target.value)} 
             />
            <div className="file-field input-field">
                <div className="btn #1e88e5 blue darken-1">
                    <span>Upload image</span>
                    <input type="file" onChange = {(event) => setImage(event.target.files[0]) }/>
                 </div>
                    <div className="file-path-wrapper">
                         <input className="file-path validate" type="text" />
                     </div>
            </div>
            <button onClick = {postDetails}
            className="btn waves-effect waves-light #1e88e5 blue darken-1">
             Upload
              </button>
        </div>
    );
}

export default CreatePost
