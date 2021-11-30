import {React, useEffect, createContext, useReducer, useContext, useState} from 'react';
import './App.css';
import Navbar from '../src/component/Navbar';
import { BrowserRouter, Route, useHistory, Switch, Redirect } from "react-router-dom";
import Home from '../src/pages/Home';
import Profile from '../src/pages/Profile';
import Signin from '../src/pages/Signin';
import Signup from '../src/pages/Signup';
import CreatePost from '../src/pages/CreatePost';
import UserProfile from '../src/pages/UserProfile';
import SubscriberPost from '../src/pages/SubscriberPost';
import Reset from '../src/pages/Reset';
import NewPassword from '../src/pages/NewPassword';
import {reducer, initialState} from './reducers/UserReducer';
import Chat from './pages/Messages/Chat';
export const UserContext = createContext()
const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext)
  
  useEffect(() => {
   const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type : "USER", payload:user}) 
    } else{
      if(!history.location.pathname.startsWith('/reset'))
        history.push('/signin')
    }
  },[])
  return (
    <Switch>
       <Route path='/' exact component = {Home} />
      <Route exact path='/profile' component = {Profile} />
      <Route exact path='/signin' render = {()=>JSON.parse(localStorage.getItem("user"))?<Redirect to='/'/>:<Signin/>} />
      <Route path='/signup' render = {()=>JSON.parse(localStorage.getItem("user"))?<Redirect to='/'/>:<Signin/>} component = {Signup} />
      <Route path='/createpost' component = {CreatePost} />
      <Route path='/profile/:userid' component = {UserProfile} />
      <Route path='/myfollowingpost' component={SubscriberPost} />
      <Route exact path='/reset' component={Reset} />
      <Route path='/reset/:token' component={NewPassword} />
      <Route path='/inbox' component={Chat} />
    </Switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
     <BrowserRouter>
      <Navbar />
      <Routing />
     </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
