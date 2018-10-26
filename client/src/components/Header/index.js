import React from 'react';
import { Link } from 'react-router-dom';

import Tower from '../Svg/tower';
import { AUTH_TOKEN } from '../../constants';

const Header = ({ history }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="flex header-content">
          <Link to="/">
            <Tower />
          </Link>
          <div className="login-context-wrapper">
            {authToken ? (
              <button
                className="logout-button"
                onClick={() => {
                  localStorage.removeItem(AUTH_TOKEN)
                  history.push(`/`)
                }}
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="ml1 no-underline black">
                <button className="login-button">Login</button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
