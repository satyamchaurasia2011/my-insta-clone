import { React, useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import "./Navbar.css";
import M from "materialize-css";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { ListItemText, MenuItem, Paper, Popper } from "@mui/material";
import { searchUser } from "../services/api";
const Navbar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [findUser, setFindUser] = useState([]);
  const [menu, setMenu] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const history = useHistory();
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const { state, dispatch } = useContext(UserContext);
  const handleClick = (event) => {
    setAnchor(event.currentTarget);
    setMenu((prev) => !prev);
    //setOpen(false);
  };
  const closemenu = () => {
    setMenu(false);
  };
  const renderList = () => {
    if (state) {
      return [
        <li key="1" className="in-right">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li key="2" className="in-right">
          <Link to="/createpost">Create Post</Link>
        </li>,
        <li key="3">
          <Link to="/myfollowingpost">My following posts</Link>
        </li>,
        <li key="4" className="in-right">
          <Link to="/inbox">Messages</Link>
        </li>,
        <li
          key="5"
          className="resp-out"
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" });
            history.push("/signin");
            setMenu(false);
          }}
        >
          <LogoutIcon />
        </li>,
        <li key="6" className="in-right">
          <img onClick={handleClick} src={state?.pic} alt />
          {menu && (
            <ClickAwayListener onClickAway={closemenu}>
              <Popper
                id="customized-menu"
                anchorEl={anchor}
                keepMounted
                open={menu}
              >
                {" "}
                <Paper
                  style={{ marginTop: "10px", border: "1px solid #e6e6e6" }}
                >
                  <MenuItem
                    style={{
                      padding: "14px 20px",
                      borderBottom: "1px solid #e6e6e6",
                    }}
                  >
                    {/* <CalendarTodayIcon style={{margin:'0px 0px 10px 12px',fontSize:'30px'}}/> */}
                    <ListItemText
                      onClick={() => {
                        history.push("/profile");
                        setMenu(false);
                      }}
                      primary="Profile"
                    />
                  </MenuItem>
                  <MenuItem style={{ padding: "14px 20px" }}>
                    <ListItemText
                      onClick={() => {
                        localStorage.clear();
                        dispatch({ type: "CLEAR" });
                        history.push("/signin");
                        setMenu(false);
                      }}
                      primary="Logout"
                    />
                  </MenuItem>
                </Paper>
              </Popper>
            </ClickAwayListener>
          )}
        </li>,
      ];
    } else {
      return [
        <li key="7">
          <Link to="/signin">SignIn</Link>
        </li>,
        <li key="8">
          <Link to="/signup">SignUp</Link>
        </li>,
      ];
    }
  };
  const handleSearch = (query) => {
    setSearch(query);
    searchUser(query)
      .then((user) => {
        setFindUser(user.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <nav>
        <div className={`${state ? "wrapper-1" : "wrapper"} nav-wrapper white`}>
          <Link
            to={state ? "/" : "/signin"}
            className={`${state ? "brand-1" : "brand"} left brand-logo`}
          >
            Instagram
          </Link>
          <ul
            id="nav-mobile"
            className={`right ${state ? "nav-in" : "nav-out"}`}
          >
            {renderList()}
          </ul>
        </div>
        <div
          id="modal1"
          className="modal"
          ref={searchModal}
          style={{ color: "black" }}
        >
          <div className="modal-content">
            <input
              type="text"
              placeholder="search user"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
            />
            <ul className="collection">
              {findUser.map((user) => {
                return (
                  <Link
                    to={
                      user._id !== state._id
                        ? "/profile/" + user._id
                        : "/profile"
                    }
                    onClick={() => {
                      M.Modal.getInstance(searchModal.current).close();
                      setSearch("");
                    }}
                  >
                    <li key={user._id} className="collection-item">
                      {user.email}
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => searchUser("")}
              className="modal-close waves-effect waves-green btn-flat"
            >
              close
            </button>
          </div>
        </div>
      </nav>
      {state && (
        <div className="responsive-nav">
          <Link to="/">
            <HomeIcon className="res-icon" />
          </Link>
          <i
            data-target="modal1"
            className="material-icons modal-trigger"
            style={{ color: "black", fontSize: "34px" }}
          >
            search
          </i>
          <Link to="/createpost">
            <AddCircleIcon className="res-icon" />
          </Link>
          <Link to="/inbox">
            <MessageRoundedIcon className="res-icon" />
          </Link>
          <Link to="/profile">
            <img src={state?.pic} alt />
          </Link>
        </div>
      )}
    </div>
  );
};
export default Navbar;
