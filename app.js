import { posts, categories } from './data/posts.js';
import Header from './components/Header.js';
import PostCard from './components/PostCard.js';

const App = () => {
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light');
    const [activeCategory, setActiveCategory] = React.useState('All');

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const filteredPosts = activeCategory === 'All'
        ? posts
        : posts.filter(post => post.category.toLowerCase() === activeCategory.toLowerCase());

    return (
        <div className="container">
            <Header theme={theme} toggleTheme={toggleTheme} />

            <section className="category-filters">
                {categories.map(cat => (
                    <span
                        key={cat}
                        className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </span>
                ))}
            </section>

            <main>
                <ul className="post-list">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => <PostCard key={post.id} post={post} />)
                    ) : (
                        <p style={{ color: 'var(--dim)', textAlign: 'center', marginTop: '40px' }}>
                            No posts found in this category yet.
                        </p>
                    )}
                </ul>
            </main>

            <footer>
                <p>&copy; 2026 ksai. Built with intent.</p>
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
