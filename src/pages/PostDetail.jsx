import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('PirateHub')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPost(data);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <h2>Loading...</h2>;

  const handleUpvote = async () => {
    const { error } = await supabase
      .from('PirateHub')
      .update({ Upvotes: post.Upvotes + 1 })
      .eq('id', id);

    if (error) {
      console.error('Error upvoting:', error);
    } else {
      setPost((prev) => ({ ...prev, Upvotes: prev.Upvotes + 1 }));
    }
  };

  const handleAddComment = async (event) => {
    event.preventDefault();
    const updatedComment = post.Comment
      ? `${post.Comment}\n${newComment}`
      : newComment;

    const { error } = await supabase
      .from('PirateHub')
      .update({ Comment: updatedComment })
      .eq('id', id);

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setPost((prev) => ({ ...prev, Comment: updatedComment }));
      setNewComment("");
    }
  };

  return (
    <div className="post-detail">
      <div className="top-buttons">
        <button onClick={() => navigate('/')} className="nav-button">⬅ Back to Home</button>
        <Link to={`/edit/${id}`}>
          <button className="nav-button">✏️ Edit Post</button>
        </Link>
      </div>

      <h1 className="post-title">{post.Title}</h1>
      <p className="post-date">Created: {new Date(post.created_at).toLocaleString()}</p>

      {post.Content && (
  <p className="post-content">{post.Content}</p>
      )}

      <p className="post-upvotes">Upvotes: {post.Upvotes}</p>
      <button onClick={handleUpvote} className="upvote-button">⬆ Upvote</button>

      {post.IMG_URL && post.IMG_URL.startsWith('http') && (
        <div className="post-image-container">
          <img src={post.IMG_URL} alt={post.Title} className="post-image" />
        </div>
      )}


      {/* Comment Section */}
      <div className="comment-section">
        <h2>Comments</h2>

        {/* Display Comments Line by Line */}
        {post.Comment ? (
          post.Comment.split('\n').map((comment, index) => (
            <p key={index} className="comment">{comment}</p>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}

        {/* Add New Comment */}
        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button type="submit" className="submit-comment-button">Submit Comment</button>
        </form>
      </div>

    </div>
  );
};

export default PostDetail;
