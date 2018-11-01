import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import CSSTransition from "react-transition-group/CSSTransition";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import client from '../../client';

import Tower from "../Svg/tower";
import { AUTH_TOKEN } from "../../constants";
import SubmitModal from "../Modal/Submit";

library.add(faSearch);

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submit: false,
      user: null,
    };

    this.dismissModal = this.dismissModal.bind(this);
  }

  static propTypes = {
    history: PropTypes.object
  };

  componentWillMount() {
    this.getUserData();
  }

  dismissModal() {
    this.setState({
      submit: false,
    });
  }

  async getUserData() {
    const { data: { user } } = await client.query({
      query: gql`
        query GetUser {
          user {
            username
          }
        }
      `,
    });

    this.setState({ user })
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const path = window.location.pathname;
    const { submit, user } = this.state;
    console.log(this.state);

    return (
      <div className="header-wrapper">
        <header className="header">
          <nav className="flex header-content">
            <div className="inline-flex">
              <Link to="/">
                <Tower />
              </Link>
              <ul
                className="header-nav inline-flex align-items-center"
                role="navigation"
              >
                <li>
                  <Link
                    to="/top"
                    className={`nav-link ${path === "/top" ? "active" : null}`}
                  >
                    Top
                  </Link>
                </li>
                <li>
                  <Link
                    to="/recent"
                    className={`nav-link ${
                      path === "/recent" ? "active" : null
                    }`}
                  >
                    Recent
                  </Link>
                </li>
                <li>
                  <Link
                    to="/comments"
                    className={`nav-link ${
                      path === "/comments" ? "active" : null
                    }`}
                  >
                    Comments
                  </Link>
                </li>
                {authToken && (
                  <li>
                    <span
                      onClick={() =>
                        this.setState({ submit: !this.state.submit })
                      }
                    >
                      Submit
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <div className="login-context-wrapper inline-flex align-items-center">
              {authToken && user ? (
                <div>
                  <p>Hi, {user.username}</p>
                  <button
                    className="logout-button"
                    onClick={() => {
                      localStorage.removeItem(AUTH_TOKEN);
                      this.props.history.push(`/`);
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="ml1 no-underline black">
                  <button className="login-button">Login</button>
                </Link>
              )}

              <div className="search-wrapper">
                <FontAwesomeIcon className="search-icon" icon="search" />
                <input
                  type="text"
                  className="search-text"
                  value=""
                  placeholder="Search"
                />
              </div>
            </div>
          </nav>
        </header>
        <CSSTransition
          in={submit}
          timeout={300}
          classNames="submit"
          unmountOnExit
        >
          <SubmitModal dismissModal={this.dismissModal} />
        </CSSTransition>
      </div>
    );
  }
}

export default Header;
