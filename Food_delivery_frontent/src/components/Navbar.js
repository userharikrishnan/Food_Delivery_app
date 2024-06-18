import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";

function Navbar() {
    var user = useSelector(store=>store.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    
    


    function logout() {
        if (user) {
          try {
            axios.post(
              "http://127.0.0.1:8000/logout",
              {},
              {
                headers: {
                  Authorization: `Token ${user.token}`,
                },
              }
            );
            dispatch(removeUser());
            alert("Logged out succesfully")
            navigate("/login");
          } catch (error) {
            console.error("Logout error:", error);
          }
        }
      }
   
  return <nav className="navbar navbar-expand-sm navbar-dark bg-warning">
        <div className="navbar-brand">
        <h2>Bite Planet</h2>
        </div>
        <button className="navbar-toggler" type="button" data-toggle="collapse"
          data-target="#navbarNav" aria-controls="navbarNav"aria-expanded="false"
           aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div
        className="collapse navbar-collapse mr-auto" id="navbarNav"  style={{float:"left" }} >
            <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>   

                {user.userId !== 2 && (
                <li className="nav-item">
                <NavLink to={"/userbookings"} className= 'nav-link ' style={{fontSize:"18px",color:"rgba(255,255,255,1)"}}>
                <i className="fa fa-bars"  data-toggle="tooltip" data-placement="top" title="My Bookings"></i>
                  </NavLink> 
                </li>  
                )}

                {user.userId !== 2 && (
                <li className="nav-item">
               <NavLink to={"/Cart"} className= 'nav-link '>
               <i className="fa" data-toggle="tooltip" data-placement="top" title="Cart" style={{fontSize:"22px",color:"rgba(255,255,255,1)"}}>&#xf07a;</i>
                </NavLink>
                </li>
                )}

                <li className="nav-item">
               <NavLink to={"/userprofile"} className= 'nav-link '>
               <i className="fas fa-user-cog " data-toggle="tooltip" data-placement="top" title="Profile" style={{fontSize:"18px",color:"rgba(255,255,255,1)"}}></i>
                </NavLink>
                </li>

                <li className="nav-item">
                <NavLink className="nav-link" onClick={logout}>
                <i className="fa"  data-toggle="tooltip" data-placement="top" title="Logout" style={{fontSize:"24px",color:"rgba(255,0,0,0.7)"}}>&#xf08b;</i>
                </NavLink>
                </li>
                
            </ul>
       </div>
    </nav>
}

export default Navbar;