import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import moment from 'moment';
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faComment, faFlag } from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Header";
import Link from "../components/Link";
import CommentForm from "../components/Forms/Comment";

library.add(faComment, faShare, faFlag);

const GET_LINK = gql`
  query GetLinkByID($link: ID!) {
    link(_id: $link) {
      _id
      author {
        _id
        username
      }
      comments {
        _id
        content
        created_at
        author {
          _id
          username
        }
      }
      created_at
      description
      score
      url
    }
  }
`;

const LinkScreen = ({ history }) => {
  const qs = window.location.pathname;

  return (
    <Query query={GET_LINK} variables={{ link: qs.replace(/\/link\//, "") }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        const {
          _id,
          author: { username },
          comments,
          created_at,
          description,
          score,
          url
        } = data.link;

        return (
          <div className="screen-wrapper flex-direction-column">
            <Header history={history} />
            <div className="link-screen-wrapper">
              <Link
                _id={_id}
                author={username}
                commentsLength={comments.length}
                createdAt={created_at}
                description={description}
                score={score}
                url={url}
              />
              <CommentForm id={_id} />
            </div>
            {comments.length > 0 && (
              <div className="comment-display-wrapper">
                <div className="comment-display-header">
                  <h2>{comments.length} Comments</h2>
                  <div className="sort-trigger-wrapper">
                    <ul className="sort-options">
                      <li className="sort-option active">Best</li>
                      <li className="sort-option">Worst</li>
                      <li className="sort-option">Newest</li>
                      <li className="sort-option">Oldest</li>
                    </ul>
                  </div>
                </div>
                <ul className="comments-list">
                  {comments.map(comment => {
                    return (
                      <li className="comment">
                        <div className="comment-meta">
                          <span>by <span className="username">{comment.author ? comment.author.username : 'anonymous'}</span></span>
                          <span className="comment-timestamp">{moment(comment.created_at, "{YYYY} MM-DDTHH:mm:ss SSS [Z] A").fromNow()}</span>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                        <div className="comment-action-area">
                          <ul className="comment-actions">
                            <li><FontAwesomeIcon className="fa-icon" icon="comment" />Reply</li>
                            <li><FontAwesomeIcon className="fa-icon" icon="share" />Share</li>
                            <li><FontAwesomeIcon className="fa-icon" icon="flag" />Report</li>
                          </ul>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        );
      }}
    </Query>
  );
};

export default LinkScreen;
