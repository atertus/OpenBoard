# OpenBoard Forum

OpenBoard is a general discussion forum where users can share ideas, post updates, upvote topics, and explore community conversations in a clean, modern experience.  
The project is built using React, Supabase, and modern responsive design techniques.

---

## 🚀 Features

### 📝 Create Posts
- Users can create new posts with:
  - Title (required)
  - Content (optional)
  - Image URL (optional; supports Imgur links, auto-converted)
- If an Imgur page link is pasted, it is automatically converted into a direct image link.

### 🔍 Search Posts
- Real-time search bar on the homepage.
- Search filters posts live based on the post Title.

### 🔃 Sort Posts
- Posts can be sorted by:
  - Newest (date created)
  - Most Upvotes
- Sorting updates dynamically without reloading the page.

### 📜 Infinite Scroll
- Homepage initially loads a limited number of posts.
- As the user scrolls down, additional posts load automatically ("infinite scroll" experience).
- No need to click any "Load More" button.

### 🆙 Upvote Posts
- Each post displays an upvote count.
- Users can upvote posts both from:
  - The homepage card view
  - The individual post detail page
- Upvotes update instantly and persist to Supabase.

### 🖼️ Image Support
- Posts can include an optional image.
- Supports direct image URLs (jpg, png, gif).
- Corrects Imgur links automatically if user pastes a page link instead of an image link.

### 🏷️ Post Details Page
- Clicking on any post opens a full-page detailed view.
- Displays:
  - Post Title
  - Post Content (if provided)
  - Creation time
  - Upvotes
  - Image (if provided)
  - Comments section

### 💬 Comment Section
- Each post detail page includes a comments area:
  - Users can view existing comments.
  - Users can submit new comments (appended to post in Supabase).
- If no comments exist, a friendly message appears.

### ✏️ Edit Posts
- Posts can be edited after creation.
- Users can modify Title, Content, and Image URL.
- Edits do not delete existing comments or upvotes.

https://openboardv1.netlify.app/

https://youtu.be/DjJi8AtEWkA
