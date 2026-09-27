import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import './App.css';
import { supabase } from './client';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Card from './Components/Card';
import PostDetail from './pages/PostDetail';

function App() {
  const [posts, setPosts] = useState([]);
  const [sortMode, setSortMode] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(10); // start by showing 10 posts

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('OpenBoard')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        setVisibleCount((prev) => prev + 5); // load 5 more posts
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-load if page is too short
  useEffect(() => {
    if (document.body.scrollHeight <= window.innerHeight) {
      setVisibleCount((prev) => prev + 5);
    }
  }, [posts]);

  const handleUpvote = async (id, currentUpvotes) => {
    const { error } = await supabase
      .from('OpenBoard')
      .update({ Upvotes: currentUpvotes + 1 })
      .eq('id', id);

    if (error) {
      console.error('Error upvoting:', error);
    } else {
      setPosts(posts.map(post =>
        post.id === id ? { ...post, Upvotes: currentUpvotes + 1 } : post
      ));
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortMode === 'date') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortMode === 'upvotes') {
      return (b.Upvotes ?? 0) - (a.Upvotes ?? 0);
    }
    return 0;
  });

  const filteredPosts = sortedPosts.filter(post =>
    post.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <Routes>
        {/* Fullscreen Post Detail */}
        <Route path="/post/:id" element={<PostDetail />} />

        {/* Main layout */}
        <Route path="/" element={
          <Layout
            posts={filteredPosts}
            visibleCount={visibleCount}
            setSortMode={setSortMode}
            sortMode={sortMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleUpvote={handleUpvote}
          />
        }>
          {/* Nested inside Layout */}
          <Route index element={<Home posts={filteredPosts} visibleCount={visibleCount} handleUpvote={handleUpvote} />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </Router>
  );
}

function Layout({ posts, visibleCount, setSortMode, sortMode, searchTerm, setSearchTerm, handleUpvote }) {
  return (
    <>
      <header>
        <h1>Welcome to OpenBoard!</h1>
        <h3>Alexander Tertus z23630485</h3>
        <nav>
         
            <h2><Link to="/">Home</Link></h2>
            <h2><Link to="/create">Create Post</Link></h2>
         
        </nav>
      </header>

      {/* Search and Sort */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <input
          type="text"
          placeholder="Search by Title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '250px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        >
          <option value="date">Sort by Date (Newest)</option>
          <option value="upvotes">Sort by Upvotes</option>
        </select>
      </div>

      {/* Child page renders here */}
      <Outlet />
    </>
  );
}

function Home({ posts, visibleCount, handleUpvote }) {
  return (
    <div className="posts">
      {posts.length > 0 ? (
        posts.slice(0, visibleCount).map((post) => (
          <Card
            key={post.id}
            id={post.id}
            title={post.Title || "No Title"}
            upvotes={post.Upvotes ?? 0}
            createdAt={post.created_at}
            onUpvote={handleUpvote}
          />
        ))
      ) : (
        <h2>No matching posts found.</h2>
      )}
    </div>
  );
}

export default App;
