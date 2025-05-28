import React, { useState } from 'react';
import Link from 'next/link';
import ContactModal from './ContactModal';

const Sidebar = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h2>Desthetik</h2>
        </div>
        <nav className="sidebar-nav">
          <a 
            href="#how-it-works" 
            className="sidebar-link"
          >
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path d="M16.1579 7.0188V12.429C16.1579 13.1084 16.1579 13.4482 16.0266 13.741C15.9834 13.8373 15.9302 13.9287 15.8678 14.0138C15.6781 14.2727 15.3828 14.4406 14.7921 14.7763L11.3342 16.7417C10.7565 17.07 10.4677 17.2342 10.1548 17.2666C10.0519 17.2773 9.94814 17.2773 9.84523 17.2666C9.53231 17.2342 9.24349 17.07 8.66584 16.7417L5.20794 14.7763C4.61722 14.4406 4.32187 14.2727 4.13216 14.0138C4.06981 13.9287 4.01661 13.8373 3.97344 13.741C3.84211 13.4482 3.84211 13.1084 3.84211 12.429V7.0188M19 5.64286L11.129 2.01969C10.6361 1.79283 10.3897 1.6794 10.1293 1.65687C10.0432 1.64943 9.95675 1.64943 9.87074 1.65687C9.61027 1.6794 9.36385 1.79283 8.87101 2.01969L1 5.64286L8.82349 9.43042C9.3362 9.67863 9.59255 9.80274 9.86493 9.82737C9.9548 9.83549 10.0452 9.83549 10.1351 9.82737C10.4075 9.80274 10.6638 9.67863 11.1765 9.43042L19 5.64286ZM19 5.64286V14.9C19 15.4876 19 15.7814 18.898 16.0437C18.8644 16.1302 18.8228 16.2134 18.7738 16.2922C18.6251 16.5311 18.3901 16.7074 17.92 17.06L16.75 17.9375" stroke="#292556" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            How it Works
          </a>
          <a 
            href="#" 
            className="sidebar-link"
            onClick={(e) => {
              e.preventDefault();
              setIsContactModalOpen(true);
            }}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M1.75 0C0.783502 0 4.49654e-09 0.7835 4.49654e-09 1.75V2.48577C-0.000162957 2.49479 -0.000162567 2.50381 4.49654e-09 2.51282V10.25C4.49654e-09 11.2165 0.783501 12 1.75 12H14.25C15.2165 12 16 11.2165 16 10.25V2.51265C16.0002 2.50376 16.0002 2.49485 16 2.48594V1.75C16 0.7835 15.2165 0 14.25 0H1.75ZM14.5 2.07029V1.75C14.5 1.61193 14.3881 1.5 14.25 1.5H1.75C1.61193 1.5 1.5 1.61193 1.5 1.75V2.07029L8 5.88063L14.5 2.07029ZM1.5 3.80902V10.25C1.5 10.3881 1.61193 10.5 1.75 10.5H14.25C14.3881 10.5 14.5 10.3881 14.5 10.25V3.80902L8.37929 7.39702C8.14507 7.53432 7.85493 7.53432 7.62071 7.39702L1.5 3.80902Z" fill="#1F2328"/>
            </svg>
            Contact
          </a>
          <a 
            href="https://github.com/Three7vn/desthetik" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="sidebar-link"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" fill="#1F2328"/>
            </svg>
            Github
          </a>
        </nav>
      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <ContactModal onClose={() => setIsContactModalOpen(false)} />
      )}

      <style jsx>{`
        .sidebar {
          width: 200px;
          height: 100vh;
          background: rgba(255, 255, 255, 0.15);
          border-right: 1px solid rgba(255, 255, 255, 0.18);
          position: fixed;
          left: 0;
          top: 0;
          padding: 1rem;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          z-index: 100;
          border-radius: 0 10px 10px 0;
        }
        .sidebar::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg, 
            rgba(255, 255, 255, 0.3) 0%, 
            rgba(255, 255, 255, 0.05) 50%, 
            rgba(255, 255, 255, 0.1) 100%
          );
          pointer-events: none;
          z-index: -1;
          border-radius: 0 10px 10px 0;
        }
        .sidebar-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .sidebar-header {
          margin-bottom: 2rem;
        }
        .sidebar-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #0070f3;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .sidebar-link {
          color: #495057;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }
        .sidebar-link:hover {
          background-color: rgba(233, 236, 239, 0.5);
          color: #495057;
        }
      `}</style>
    </div>
  );
};

export default Sidebar; 