import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

const Card = (props) => {
  const formattedDate = props.createdAt
    ? new Date(props.createdAt).toLocaleString()
    : "";

  return (
    <div className="CardContainer">
      <Link to={`/post/${props.id}`} className="CardLink">
        <div className="Card">
          <h2 className="title">{props.title}</h2>
          <p className="timestamp">Created: {formattedDate}</p>
          <p className="upvotes">Upvotes: {props.upvotes}</p>

          {/* Upvote Button */}
          <button
            className="upvoteButton"
            onClick={(e) => {
              e.preventDefault(); // prevent link click
              props.onUpvote(props.id, props.upvotes);
            }}
          >
            ⬆ Upvote
          </button>
        </div>
      </Link>

      <Link to={`/edit/${props.id}`}>
        <button className="editButtonOnCard">✏️ Edit</button>
      </Link>
    </div>
  );
};

export default Card;
