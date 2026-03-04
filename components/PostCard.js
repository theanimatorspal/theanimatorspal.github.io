const PostCard = ({ post, onClick }) => {
    return (
        <div className="post-card" onClick={onClick}>
            <div className="pc-meta">
                <span>{post.date}</span>
                <span style={{ color: 'var(--accent)' }}>{post.category}</span>
            </div>
            <h2 className="pc-title" style={post.isDevanagari ? { fontFamily: 'var(--font-serif)' } : {}}>
                {post.title}
            </h2>
            <p className="pc-excerpt">{post.excerpt}</p>
        </div>
    );
};


