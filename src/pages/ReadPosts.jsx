import React, { useState, useEffect } from 'react';
import { supabase } from '../client';

const ReadPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('OpenBoard') // Ensure this matches your Supabase table name
                .select()
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching posts:', error);
            } else {
                setPosts(data);
            }
        };

        fetchPosts();
    }, []);

    const handleUpvote = async (id, currentUpvotes) => {
        const { data, error } = await supabase
            .from('OpenBoard')
            .update({ Upvotes: currentUpvotes + 1 })
            .eq('id', id);

        if (error) {
            console.error('Error updating upvotes:', error);
        } else {
            // Update the local state to reflect the new upvote count
            setPosts(posts.map(post => 
                post.id === id ? { ...post, Upvotes: currentUpvotes + 1 } : post
            ));
        }
    };

    return (
        <div className="ReadPosts">
            <h1>OpenBoard Posts</h1>
            {
                posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="post">
                            <h2>{post.Title}</h2>
                            <p>{post.Content}</p>
                            {post.IMG_URL && <img src={post.IMG_URL} alt={post.Title} />}
                            <p>Upvotes: {post.Upvotes}</p>
                            <button onClick={() => handleUpvote(post.id, post.Upvotes)}>
                                Upvote
                            </button>
                        </div>
                    ))
                ) : (
                    <h2>No posts found. Be the first to add a post!</h2>
                )
            }
        </div>
    );
};

export default ReadPosts;