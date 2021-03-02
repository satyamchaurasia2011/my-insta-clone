import {React, useEffect, createContext, useReducer, useContext} from 'react';
import './App.css';
import Navbar from '../src/component/Navbar';
import { BrowserRouter, Route, useHistory, Switch } from "react-router-dom";
import Home from '../src/component/pages/Home';
import Profile from '../src/component/pages/Profile';
import Signin from '../src/component/pages/Signin';
import Signup from '../src/component/pages/Signup';
import CreatePost from '../src/component/pages/CreatePost';
import UserProfile from '../src/component/pages/UserProfile';
import SubscriberPost from '../src/component/pages/SubscriberPost';
import {reducer, initialState} from './component/reducers/UserReducer';
export const UserContext = createContext()
const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type : "USER", payload:user}) 
    } else{
      history.push('/signin')
    }
  },[])
  return (
    <Switch>
       <Route path='/' exact component = {Home} />
      <Route exact path='/profile' component = {Profile} />
      <Route path='/signin' component = {Signin} />
      <Route path='/signup' component = {Signup} />
      <Route path='/createpost' component = {CreatePost} />
      <Route path='/profile/:userid' component = {UserProfile} />
      <Route path='/myfollowingpost' component={SubscriberPost} />
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
