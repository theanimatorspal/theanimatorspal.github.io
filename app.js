/** App.js - Modern Feed for ksaiocracy */

const App = () => {
    // Theme state - default to DARK
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');
    const [activeCategory, setActiveCategory] = React.useState('All');
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [activePost, setActivePost] = React.useState(null);
    const [postContent, setPostContent] = React.useState('');

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    React.useEffect(() => {
        if (activePost) {
            fetch(activePost.path)
                .then(res => res.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const content = doc.querySelector('.view-post');
                    if (content) {
                        const backBtn = content.querySelector('.back-btn');
                        if (backBtn) backBtn.remove();
                        setPostContent(content.innerHTML);
                        // Trigger Highlight.js
                        setTimeout(() => {
                            if (window.hljs) hljs.highlightAll();
                        }, 100);
                    }
                })
                .catch(err => console.error("Error loading post:", err));

            if (window.innerWidth < 850) setSidebarOpen(false);
            window.scrollTo(0, 0);
        } else {
            setPostContent('');
        }
    }, [activePost]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // 'posts' and 'categories' are available globally from data/posts.js
    const filteredPosts = activeCategory === 'All'
        ? posts
        : posts.filter(post => post.category.toLowerCase() === activeCategory.toLowerCase());

    return (
        <div className="app-wrapper">
            <Sidebar
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                closeSidebar={() => setSidebarOpen(false)}
                isOpen={sidebarOpen}
                setActivePost={setActivePost}
            />

            <button className="mobile-nav-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? '✕' : '☰'}
            </button>

            <main className={`content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="header-top">
                    <button className="theme-btn" onClick={toggleTheme}>
                        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                    </button>
                </div>

                <div className="feed">
                    {activePost ? (
                        <div className="view-post">
                            <button className="back-btn" onClick={() => setActivePost(null)}>← Back to Feed</button>
                            <div className="post-body-content" dangerouslySetInnerHTML={{ __html: postContent }} />
                        </div>
                    ) : (
                        <>
                            <header style={{ marginBottom: '60px' }}>
                                <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.04em', marginBottom: '12px' }}>
                                    {activeCategory === 'All' ? 'Latest Musings' : activeCategory}
                                </h1>
                                <p style={{ color: 'var(--dim)', fontSize: '1.2rem' }}>
                                    Exploring the intersections of life, code, and everything in between.
                                </p>
                            </header>

                            <div className="post-grid">
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map(post => (
                                        <div key={post.id} onClick={() => setActivePost(post)} style={{ cursor: 'pointer' }}>
                                            <PostCard post={post} />
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--dim)' }}>
                                        <p>No posts in this category yet. Stay tuned.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
