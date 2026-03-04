const PostCard = ({ post }) => {
    return (
        <li className="post-item">
            <div className="post-meta">
                <span className="post-date">{post.date}</span>
                <span className="post-category">#{post.category}</span>
            </div>
            <h2 className="post-title" style={post.isDevanagari ? { fontFamily: 'var(--font-serif)' } : {}}>
                <a href={post.path}>{post.title}</a>
            </h2>
            <p className="post-excerpt">{post.excerpt}</p>
        </li>
    );
};

export default PostCard;
