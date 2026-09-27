import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EditPost.css';
import { supabase } from '../client';

const EditPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState({
        id: null,
        Title: "",
        Content: "",
        IMG_URL: "",
    });

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('OpenBoard') // Ensure this matches your Supabase table name
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setPost(data);
            } else if (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updatePost = async (event) => {
        event.preventDefault();
        console.log("Updating post with data:", post);
    
        try {
            const { data, error } = await supabase
                .from('OpenBoard')
                .update({
                    Title: post.Title,
                    Content: post.Content,
                    IMG_URL: post.IMG_URL,
                    Comment: post.Comment || "" 
                })
                .eq('id', id);
    
            if (error) {
                console.error("Error updating post:", error);
                alert("Failed to update the post. Please try again.");
            } else {
                console.log("Update successful:", data);
                alert("Post updated successfully!");
                window.location = "/";
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred. Please try again.");
        }
    };
    

    const deletePost = async (event) => {
        event.preventDefault();
        try {
            const { error } = await supabase
                .from('OpenBoard')
                .delete()
                .eq('id', id);

            if (error) {
                console.error("Error deleting post:", error);
                alert("Failed to delete the post. Please try again.");
            } else {
                alert("Post deleted successfully!");
                window.location = "/";
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div>
            <form>
                <label htmlFor="Title">Title</label> <br />
                <input
                    type="text"
                    id="Title"
                    name="Title"
                    value={post.Title || ""}
                    onChange={handleChange}
                /><br /><br />

                <label htmlFor="Content">Content</label><br />
                <textarea
                    id="Content"
                    name="Content"
                    value={post.Content || ""}
                    onChange={handleChange}
                /><br /><br />

                <label htmlFor="IMG_URL">Image URL</label><br />
                <input
                    type="url"
                    id="IMG_URL"
                    name="IMG_URL"
                    value={post.IMG_URL || ""}
                    onChange={handleChange}
                /><br /><br />

                <input type="submit" value="Submit" onClick={updatePost} />
                <button className="deleteButton" onClick={deletePost}>Delete</button>
            </form>
        </div>
    );
};

export default EditPost;