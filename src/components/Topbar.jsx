import { useState } from "react";
import '../styles/Topbar.css';
import {
  SearchIcon,
  UserIcon,
  SettingsIcon,
  BellIcon
} from '../components/Icons';

import { Link, useLocation } from 'react-router-dom';

export default function Topbar({
  onSignInClick,
  data,
  userData,
  isLoggedIn
}) {
  const [query, setQuery] = useState("");
  const location = useLocation();

  const path = location.pathname;

  const getPageTitle = () => {
    if (path === "/") return "Dashboard";
    if (path === "/profile") return "Profile";
    if (path === "/transactions") return "Transactions";

    return path.replace("/", "").replace("-", " ");
  };

  return (
    <header className="topbar">
      <div className="topbar__breadcrumb">
        <div className="topbar__path">
          <span>Home</span>
          <span className="topbar__sep">/</span>
          <span>{getPageTitle()}</span>
        </div>

        <div className="topbar__title">
          {getPageTitle()}
        </div>
      </div>

      <div className="topbar__actions">
        
        <div className="topbar__search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Type here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="topbar__divider" />

        {isLoggedIn ? (
          <Link to="/profile">
            <button className="topbar__btn">
              {userData?.username || "User"}
            </button>
          </Link>
        ) : (
          <button className="topbar__btn" onClick={onSignInClick}>
            <UserIcon />
            Sign in
          </button>
        )}

        <button className="topbar__icon-btn" title="Settings">
          <SettingsIcon />
        </button>

        <button className="topbar__icon-btn" title="Notifications">
          <BellIcon />
          <span className="topbar__badge" />
        </button>
      </div>
    </header>
  );
}