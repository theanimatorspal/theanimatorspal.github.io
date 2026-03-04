const Sidebar = ({ categories, activeCategory, setActiveCategory, closeSidebar, isOpen, setActivePost }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="logo-container" onClick={() => {
                setActiveCategory('All');
                setActivePost(null);
                window.scrollTo(0, 0);
                if (window.innerWidth < 850) closeSidebar();
            }}>
                <img src="resources/logo.png" alt="Logo" className="logo-img" />
                <span className="brand-name">ksaiocracy</span>
            </div>

            <nav className="categories">
                <span className="nav-label">Categories</span>
                <ul className="category-list">
                    {categories.map(cat => (
                        <li
                            key={cat}
                            className={`category-item ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategory(cat);
                                setActivePost(null);
                                if (window.innerWidth < 850) closeSidebar();
                            }}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <p style={{ fontSize: '0.75rem', color: 'var(--dim)' }}>&copy; 2026 ksai</p>
            </div>
        </aside>
    );
};


