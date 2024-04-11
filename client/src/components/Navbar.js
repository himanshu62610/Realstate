import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const navbarStyle = {
  backgroundColor: '#FFFF',
};

export default function Navbar() {
  // context
  const [auth, setAuth] = useAuth();
  // hooks
  const navigate = useNavigate();

  const logout = () => {
    setAuth({ user: null, token: "", refreshToken: "" });
    localStorage.removeItem("auth");
    navigate("/login");
  };
  
  const loggedIn =
    auth.user !== null && auth.token !== "" && auth.refreshToken !== "";

    
  const handlePostAdClick = () => {
    if (loggedIn) {
      navigate("/ad/create");
    } else {
      navigate("/login");
    }
  };
 
  return (
  <div>
    <nav className="nav d-flex justify-content-between lead ">
    <NavLink className="nav-link" aria-current="page" to="/" >
      Home
    </NavLink>
    <NavLink className="nav-link" aria-current="page" to="/search" >
      Search
    </NavLink>

    <NavLink className="nav-link" aria-current="page" to="/buy">
        Buy
      </NavLink>

      <NavLink className="nav-link" aria-current="page" to="/rent">
        Rent
      </NavLink>
      <NavLink className="nav-link" aria-current="page" to="/agents">
        Agents
      </NavLink>

      
    <a className="nav-link pointer" onClick={handlePostAdClick} >
        Post Ad
      </a> 
    {!loggedIn ? (
      <>
        <NavLink className="nav-link" to="/login" >
          Login
        </NavLink>
        <NavLink className="nav-link" to="/register" >
          Register
        </NavLink>
      </>
    ) : (
      ""
    )}

    {loggedIn ? (
      <div className="dropdown">
        <li>
          <a className="nav-link dropdown-toggle pointer" data-bs-toggle="dropdown">
            {auth?.user?.name ? auth.user.name : auth.user.username}
          </a>
          <ul className="dropdown-menu">
            <li>
              <NavLink className="nav-link" to="/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li>
              <a onClick={logout} className="nav-link pointer" >
                Logout
              </a>
            </li>
          </ul>
        </li>
      </div>
    ) : (
      ""
    )}
  </nav>



      <div>
      {/* <nav className="navbar navbar-expand-lg font-light" style = {navbarStyle}>
  <div class="container-fluid">
    <Link class="navbar-brand" href="#"><large>GharDekho</large></Link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to="/">Home</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/search">Search</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/buy">Buy</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/rent">Rent</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/agents">Agents</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/">Post Ad</Link>
          <Link className="nav-link pointer" onClick={handlePostAdClick} >
        Post Ad
      </Link> 
        </li>
        
      </ul>
      {!loggedIn ? (
      <>
        <NavLink className="nav-link" to="/login" >
          Login
        </NavLink>
        <NavLink className="nav-link" to="/register" >
          Register
        </NavLink>
      </>
    ) : (
      ""
    )}

    {loggedIn ? (
      <div className="dropdown">
        <li>
          <Link className="nav-link dropdown-toggle pointer" data-bs-toggle="dropdown">
            {auth?.user?.name ? auth.user.name : auth.user.username}
          </Link>
          <ul className="dropdown-menu">
            <li>
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li>
              <Link onClick={logout} className="nav-link pointer" >
                Logout
              </Link>
            </li>
          </ul>
        </li>
      </div>
    ) : (
      ""
    )}
    </div>
  </div>
</nav> */}

      </div>
  </div>
);
}


