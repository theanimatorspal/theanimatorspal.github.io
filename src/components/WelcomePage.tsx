import React, { useState } from 'react';
import { MOCK_SUBJECTS, MOCK_CONTENT } from '../data/mockData';
import type { ContentType, AccessLevel } from '../types/content';

export const WelcomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | ContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mockUserRole, setMockUserRole] = useState<'guest' | 'member'>('guest');

  const filteredContent = MOCK_CONTENT.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getAccessBadge = (level: AccessLevel) => {
    switch (level) {
      case 'public':
        return (
          <span style={{
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.7rem',
            fontWeight: 600,
            padding: '0.1rem 0.4rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            PUBLIC
          </span>
        );
      case 'member':
        return (
          <span style={{
            backgroundColor: 'var(--brand-light)',
            color: 'var(--brand-primary)',
            border: '1px solid var(--brand-primary)',
            fontSize: '0.7rem',
            fontWeight: 600,
            padding: '0.1rem 0.4rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            MEMBER
          </span>
        );
      case 'premium':
        return (
          <span style={{
            backgroundColor: 'var(--text-primary)',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 600,
            padding: '0.1rem 0.4rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            PREMIUM
          </span>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* Platform Banner */}
      <div style={{
        backgroundColor: 'var(--brand-primary)',
        color: '#ffffff',
        padding: '0.4rem 1.5rem',
        fontSize: '0.8rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <strong>KSAI</strong> - Arts, Philosophy and Tech together
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Access Mode: <strong>{mockUserRole.toUpperCase()}</strong></span>
          <button
            onClick={() => setMockUserRole(mockUserRole === 'guest' ? 'member' : 'guest')}
            style={{
              backgroundColor: '#fff',
              color: 'var(--brand-primary)',
              border: 'none',
              padding: '0.15rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              borderRadius: '2px'
            }}
          >
            Switch to {mockUserRole === 'guest' ? 'Member' : 'Guest'}
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1120px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            {/* Logo */}
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: 'var(--brand-primary)',
              letterSpacing: '-0.03em'
            }}>
              KSAI
            </div>

            <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
              <a href="#catalog" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Content Archive</a>
              <a href="#subjects" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Subjects</a>
              <a href="#apps" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Utilities</a>
              <a href="#membership" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Membership Plan</a>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Search lessons, tools, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.4rem 0.8rem',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                fontSize: '0.85rem',
                width: '220px',
                outline: 'none',
                fontFamily: 'var(--font-body)'
              }}
            />
            <button style={{
              backgroundColor: 'var(--text-primary)',
              color: '#fff',
              border: 'none',
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              {mockUserRole === 'member' ? 'Dashboard' : 'Sign In'}
            </button>
          </div>
        </div>
      </header>

      {/* Editorial Hero Section */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '3.5rem 2rem 2.5rem 2rem'
      }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.8rem',
            lineHeight: 1.15,
            fontWeight: 500,
            maxWidth: '850px',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            A place to bring Arts, Philosophy and Technology together
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            maxWidth: '680px',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            KSAI is an eclectic space for arts and technology, bringing music, history, linguistics, philosophy, mathematics and anything that interests me together in the form of videos, articles and else.
          </p>

          {/* Platform Quick Stats Bar */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)'
          }}>
            <div><strong style={{ color: 'var(--text-primary)' }}>4</strong> Main Subjects</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>47+</strong> Total Modules</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>6</strong> Web Applications</div>
            <div><strong style={{ color: 'var(--text-primary)' }}>100%</strong> Serverless Prototype</div>
          </div>
        </div>
      </section>

      {/* Subject Categories Bar */}
      <section id="subjects" style={{ padding: '2.5rem 2rem', maxWidth: '1120px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 500 }}>
          Primary Subject Areas
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem'
        }}>
          {MOCK_SUBJECTS.map((subj) => (
            <div key={subj.id} style={{
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  marginBottom: '0.3rem'
                }}>
                  {subj.itemCount} items
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                  {subj.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {subj.description}
                </p>
              </div>
              <a href="#catalog" style={{
                display: 'inline-block',
                marginTop: '1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--brand-primary)',
                textDecoration: 'none'
              }}>
                Browse Subject →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Structured Membership Callout */}
      <section id="membership" style={{ padding: '4rem 2rem', maxWidth: '1120px', margin: '0 auto', width: '100%' }}>
        <div style={{
          border: '1px solid var(--border-strong)',
          backgroundColor: 'var(--bg-surface)',
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              Simple, Straightforward Membership
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Access public articles and foundational tools for free. Subscribe to unlock everything.
            </p>
            <ul style={{
              listStyleType: 'square',
              paddingLeft: '1.2rem',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8
            }}>
              <li>Unlimited access to all video courses & written lessons</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 600, color: 'var(--brand-primary)' }}>
              $5 / month
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
              Cancel anytime. No lock-in.
            </div>
            <button style={{
              backgroundColor: 'var(--brand-primary)',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.2rem',
              width: '100%',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              Join KSAI Membership
            </button>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '2.5rem 2rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1120px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <strong style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>KSAI</strong>
          </div>
          <div>
             © 2025 KSAI (Darshan Koirala). All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};