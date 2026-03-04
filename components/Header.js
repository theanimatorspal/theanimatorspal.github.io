const Header = ({ theme, toggleTheme }) => {
    return (
        <header>
            <div className="brand">
                <h1>ksaiocracy</h1>
                <p className="tagline">Thoughts from the edge of order and chaos.</p>
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
        </header>
    );
};


