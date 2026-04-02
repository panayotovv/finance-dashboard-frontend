import '../styles/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faChartBar, 
  faCreditCard, 
  faGlobe, 
  faUser, 
  faSignInAlt, 
  faUserPlus,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';

import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isLoggedIn, onLogout, onSignInClick, onSignUpClick }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="nav-container">

      <div className="nav-logo">
        <p>WEALTHWAVE</p>
      </div>

      <nav>
        <ul>

          <li className={isActive('/') ? 'active' : ''}>
            <Link to="/">
              <div className="icon-container">
                <FontAwesomeIcon icon={faHome} className="icon" />
              </div>
              Dashboard
            </Link>
          </li>

          <li className={isActive('/transactions') ? 'active' : ''}>
            <Link to="/transactions">
              <div className="icon-container">
                <FontAwesomeIcon icon={faChartBar} className="icon" />
              </div>
              Tables
            </Link>
          </li>

          <li className={isActive('/billing') ? 'active' : ''}>
            <Link to="/billing">
              <div className="icon-container">
                <FontAwesomeIcon icon={faCreditCard} className="icon" />
              </div>
              Billing
            </Link>
          </li>

          <li className={isActive('/profile') ? 'active' : ''}>
            <Link to="/profile">
              <div className="icon-container">
                <FontAwesomeIcon icon={faUser} className="icon" />
              </div>
              Profile
            </Link>
          </li>

          {!isLoggedIn && (
            <>
              <li>
                <button onClick={onSignInClick} className="nav-button">
                  <div className="icon-container">
                    <FontAwesomeIcon icon={faSignInAlt} className="icon" />
                  </div>
                  Sign in
                </button>
              </li>

              <li>
                <button onClick={onSignUpClick} className="nav-button">
                  <div className="icon-container">
                    <FontAwesomeIcon icon={faUserPlus} className="icon" />
                  </div>
                  Sign up
                </button>
              </li>
            </>
          )}

          {isLoggedIn && (
            <li>
              <button className="logout-btn" onClick={onLogout}>
                <div className="icon-container">
                  <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
                </div>
                Logout
              </button>
            </li>
          )}

        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;