import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';
import { supabase } from '../client';

// Helper function to fix Imgur URLs
function fixImgurUrl(url) {
  if (!url) return '';
  if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    return `https://i.imgur.com/${id}.png`; // Default to .png
  }
  return url;
}

const CreatePost = () => {
  const [post, setPost] = useState({
    Title: "",
    Content: "",
    IMG_URL: ""
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createPost = async (event) => {
    event.preventDefault();

    const fixedImgUrl = fixImgurUrl(post.IMG_URL);

    const { error } = await supabase
      .from('PirateHub')
      .insert({
        Title: post.Title,
        Content: post.Content,
        IMG_URL: fixedImgUrl,
        Upvotes: 0,
        Comment: "" // Initialize empty comment
      });

    if (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post.');
    } else {
      alert('Post created successfully!');
      navigate("/");
    }
  };

  return (
    <div className="create-post">
      <h1>Create a New Post</h1>
      <form onSubmit={createPost}>
        <label htmlFor="Title">Title</label><br />
        <input
          type="text"
          id="Title"
          name="Title"
          value={post.Title}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="Content">Content</label><br />
        <textarea
            id="Content"
            name="Content"
            value={post.Content}
            onChange={handleChange}
           /><br /><br />

        <label htmlFor="IMG_URL">Image URL</label><br />
        <input
          type="url"
          id="IMG_URL"
          name="IMG_URL"
          value={post.IMG_URL}
          onChange={handleChange}
          placeholder="Paste direct link or Imgur page link"
        /><br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
