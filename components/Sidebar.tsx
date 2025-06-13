import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ContactModal from './ContactModal';

const Sidebar = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('how-it-works');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Listen for hash changes to update active state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#how-it-works') {
        setCurrentPage('how-it-works');
      } else if (hash.startsWith('#playground')) {
        setCurrentPage('playground');
      } else {
        // Default to 'how-it-works' when no hash is present
        setCurrentPage('how-it-works');
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="sidebar" data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h2>Desthetik</h2>
        </div>
        <nav className="sidebar-nav">
          <a 
            href="#playground" 
            className={`sidebar-link ${currentPage === 'playground' ? 'active' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_2510_81)">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.53194 10.1522C8.86839 9.98986 9.27273 10.0981 9.48359 10.407L12.1476 14.3096C12.3833 14.6549 12.2951 15.1264 11.9506 15.3626C11.6061 15.5989 11.1357 15.5105 10.9 15.1652L9.00448 12.3883V15.2424C9.00448 15.6608 8.6661 16 8.24868 16C7.83127 16 7.49288 15.6608 7.49288 15.2424V12.3883L5.59732 15.1652C5.36162 15.5105 4.89127 15.5989 4.54677 15.3626C4.20228 15.1264 4.11409 14.6549 4.34979 14.3096L6.41325 11.2867C6.48793 11.1773 6.58996 11.0895 6.70913 11.032L8.53194 10.1522Z" fill="#1F2328"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.9317 0.263566C12.6583 -0.233002 13.6527 -0.00552935 14.0924 0.757808L15.7971 3.71737C16.2368 4.48071 15.9361 5.45766 15.1438 5.84005L2.85192 11.7724C2.13926 12.1164 1.28256 11.8515 0.887068 11.1649L0.202675 9.97669C-0.192813 9.29009 0.00666143 8.41398 0.660168 7.96733L11.9317 0.263566ZM3.23955 8.03823L4.08035 9.49794L5.44612 8.83879L4.49195 7.18226L3.23955 8.03823ZM11.0268 6.14542L9.60937 3.68466L10.8618 2.82869L12.3925 5.48626L11.0268 6.14542Z" fill="#1F2328"/>
              </g>
              <defs>
                <clipPath id="clip0_2510_81">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span>Playground</span>
          </a>
          <a 
            href="#how-it-works" 
            className={`sidebar-link ${currentPage === 'how-it-works' ? 'active' : ''}`}
          >
            <svg width="18" height="17" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.1579 7.0188V12.429C16.1579 13.1084 16.1579 13.4482 16.0266 13.741C15.9834 13.8373 15.9302 13.9287 15.8678 14.0138C15.6781 14.2727 15.3828 14.4406 14.7921 14.7763L11.3342 16.7417C10.7565 17.07 10.4677 17.2342 10.1548 17.2666C10.0519 17.2773 9.94814 17.2773 9.84523 17.2666C9.53231 17.2342 9.24349 17.07 8.66584 16.7417L5.20794 14.7763C4.61722 14.4406 4.32187 14.2727 4.13216 14.0138C4.06981 13.9287 4.01661 13.8373 3.97344 13.741C3.84211 13.4482 3.84211 13.1084 3.84211 12.429V7.0188M19 5.64286L11.129 2.01969C10.6361 1.79283 10.3897 1.6794 10.1293 1.65687C10.0432 1.64943 9.95675 1.64943 9.87074 1.65687C9.61027 1.6794 9.36385 1.79283 8.87101 2.01969L1 5.64286L8.82349 9.43042C9.3362 9.67863 9.59255 9.80274 9.86493 9.82737C9.9548 9.83549 10.0452 9.83549 10.1351 9.82737C10.4075 9.80274 10.6638 9.67863 11.1765 9.43042L19 5.64286ZM19 5.64286V14.9C19 15.4876 19 15.7814 18.898 16.0437C18.8644 16.1302 18.8228 16.2134 18.7738 16.2922C18.6251 16.5311 18.3901 16.7074 17.92 17.06L16.75 17.9375" stroke="#292556" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>How it Works</span>
          </a>
          <a 
            href="#" 
            className="sidebar-link"
            onClick={(e) => {
              e.preventDefault();
              setIsContactModalOpen(true);
            }}
          >
            <svg width="15" height="11" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M1.75 0C0.783502 0 4.49654e-09 0.7835 4.49654e-09 1.75V2.48577C-0.000162957 2.49479 -0.000162567 2.50381 4.49654e-09 2.51282V10.25C4.49654e-09 11.2165 0.783501 12 1.75 12H14.25C15.2165 12 16 11.2165 16 10.25V2.51265C16.0002 2.50376 16.0002 2.49485 16 2.48594V1.75C16 0.7835 15.2165 0 14.25 0H1.75ZM14.5 2.07029V1.75C14.5 1.61193 14.3881 1.5 14.25 1.5H1.75C1.61193 1.5 1.5 1.61193 1.5 1.75V2.07029L8 5.88063L14.5 2.07029ZM1.5 3.80902V10.25C1.5 10.3881 1.61193 10.5 1.75 10.5H14.25C14.3881 10.5 14.5 10.3881 14.5 10.25V3.80902L8.37929 7.39702C8.14507 7.53432 7.85493 7.53432 7.62071 7.39702L1.5 3.80902Z" fill="#1F2328"/>
            </svg>
            <span>Contact</span>
          </a>
          <a 
            href="https://github.com/Three7vn/desthetik" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="sidebar-link"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" fill="#1F2328"/>
            </svg>
            <span>Github</span>
          </a>
        </nav>
        
        {/* Dark/Light Mode Toggle */}
        <div className="theme-toggle">
          <button 
            onClick={toggleDarkMode}
            className="theme-toggle-btn"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              // Light mode icon (sun) - white when in dark mode
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_857_34)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5ZM8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M8 0C8.41421 0 8.75 0.335786 8.75 0.75V2.25C8.75 2.66421 8.41421 3 8 3C7.58579 3 7.25 2.66421 7.25 2.25V0.75C7.25 0.335786 7.58579 0 8 0ZM8 13C8.41421 13 8.75 13.3358 8.75 13.75V15.25C8.75 15.6642 8.41421 16 8 16C7.58579 16 7.25 15.6642 7.25 15.25V13.75C7.25 13.3358 7.58579 13 8 13Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M2.34329 2.34329C2.63618 2.0504 3.11106 2.0504 3.40395 2.34329L4.46461 3.40395C4.7575 3.69684 4.7575 4.17172 4.46461 4.46461C4.17172 4.7575 3.69684 4.7575 3.40395 4.46461L2.34329 3.40395C2.0504 3.11106 2.0504 2.63618 2.34329 2.34329ZM11.5357 11.5357C11.8286 11.2428 12.3034 11.2428 12.5963 11.5357L13.657 12.5963C13.9499 12.8892 13.9499 13.3641 13.657 13.657C13.3641 13.9499 12.8892 13.9499 12.5963 13.657L11.5357 12.5963C11.2428 12.3034 11.2428 11.8286 11.5357 11.5357Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M16 8C16 8.41421 15.6642 8.75 15.25 8.75H13.75C13.3358 8.75 13 8.41421 13 8C13 7.58579 13.3358 7.25 13.75 7.25H15.25C15.6642 7.25 16 7.58579 16 8ZM3 8C3 8.41421 2.66421 8.75 2.25 8.75H0.75C0.335787 8.75 -1.81058e-08 8.41421 0 8C1.81058e-08 7.58579 0.335787 7.25 0.75 7.25H2.25C2.66421 7.25 3 7.58579 3 8Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.6567 2.34329C13.9496 2.63618 13.9496 3.11106 13.6567 3.40395L12.596 4.46461C12.3032 4.7575 11.8283 4.7575 11.5354 4.46461C11.2425 4.17172 11.2425 3.69684 11.5354 3.40395L12.596 2.34329C12.8889 2.0504 13.3638 2.0504 13.6567 2.34329ZM4.46432 11.5357C4.75721 11.8286 4.75721 12.3034 4.46432 12.5963L3.40366 13.657C3.11077 13.9499 2.63589 13.9499 2.343 13.657C2.05011 13.3641 2.05011 12.8892 2.343 12.5963L3.40366 11.5357C3.69655 11.2428 4.17143 11.2428 4.46432 11.5357Z" fill="white"/>
                </g>
                <defs>
                  <clipPath id="clip0_857_34">
                    <rect width="16" height="16" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            ) : (
              // Dark mode icon (moon) - black in light mode
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.59796 1.59115C9.80375 1.38536 10.11 1.3172 10.3837 1.4163C13.075 2.39093 15 4.96959 15 7.99976C15 11.8658 11.866 14.9998 8.00001 14.9998C4.96983 14.9998 2.39117 13.0748 1.41654 10.3834C1.31745 10.1098 1.3856 9.8035 1.5914 9.59771C1.79719 9.39192 2.10345 9.32376 2.37709 9.42286C2.96068 9.6342 3.59102 9.74976 4.25001 9.74976C7.28757 9.74976 9.75001 7.28733 9.75001 4.24976C9.75001 3.59077 9.63444 2.96044 9.4231 2.37685C9.32401 2.10321 9.39217 1.79694 9.59796 1.59115ZM11.214 3.53583C11.2378 3.77069 11.25 4.00887 11.25 4.24976C11.25 8.11576 8.116 11.2498 4.25001 11.2498C4.00912 11.2498 3.77094 11.2376 3.53608 11.2137C4.53522 12.5989 6.16298 13.4998 8.00001 13.4998C11.0376 13.4998 13.5 11.0373 13.5 7.99976C13.5 6.16273 12.5991 4.53497 11.214 3.53583Z" fill="#1F2328"/>
              </svg>
            )}
            <span>{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <ContactModal onClose={() => setIsContactModalOpen(false)} />
      )}

      <style jsx>{`
        .sidebar {
          width: 120px;
          height: 100vh;
          background: #F5F5F7;
          border-right: 1px solid rgba(255, 255, 255, 0.18);
          position: fixed;
          left: 0;
          top: 0;
          padding: 0.75rem;
          z-index: 100;
          border-radius: 0 10px 10px 0;
          transition: background-color 0.3s ease;
        }
        .sidebar[data-theme="dark"] {
          background: #1a1a1a;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }
        .sidebar::before {
          display: none;
        }
        .sidebar-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .sidebar-header {
          margin-bottom: 1.5rem;
        }
        .sidebar-header h2 {
          margin: 0;
          font-size: 1.13rem;
          color: #0070f3;
        }
        .sidebar[data-theme="dark"] .sidebar-header h2 {
          color: #4da6ff;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          flex: 1;
        }
        .sidebar-link {
          color: #495057;
          text-decoration: none;
          padding: 0.4rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.4rem;
        }
        .sidebar[data-theme="dark"] .sidebar-link {
          color: white;
        }
        .sidebar[data-theme="dark"] .sidebar-link svg path {
          fill: white;
        }
        .sidebar-link.active {
          background-color: rgba(0, 112, 243, 0.08);
          color: #495057;
        }
        .sidebar[data-theme="dark"] .sidebar-link.active {
          background-color: rgba(77, 166, 255, 0.15);
          color: white;
        }
        .sidebar-link span {
          font-size: 0.79rem;
          font-weight: 500;
        }
        .sidebar-link:hover {
          background-color: rgba(233, 236, 239, 0.5);
          color: #495057;
        }
        .sidebar[data-theme="dark"] .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .sidebar-link.active:hover {
          background-color: rgba(0, 112, 243, 0.12);
          color: #495057;
        }
        .sidebar[data-theme="dark"] .sidebar-link.active:hover {
          background-color: rgba(77, 166, 255, 0.2);
          color: white;
        }
        .theme-toggle {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        .sidebar[data-theme="dark"] .theme-toggle {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        .theme-toggle-btn {
          width: 100%;
          background: none;
          border: none;
          padding: 0.4rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.4rem;
          color: #495057;
        }
        .sidebar[data-theme="dark"] .theme-toggle-btn {
          color: white;
        }
        .theme-toggle-btn span {
          font-size: 0.79rem;
          font-weight: 500;
        }
        .theme-toggle-btn:hover {
          background-color: rgba(233, 236, 239, 0.5);
        }
        .sidebar[data-theme="dark"] .theme-toggle-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Sidebar; 