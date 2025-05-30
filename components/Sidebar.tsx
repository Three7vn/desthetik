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
            href="#playground" 
            className="sidebar-link active"
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
            className="sidebar-link"
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
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
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
        .sidebar-link.active {
          background-color: rgba(0, 112, 243, 0.08);
          color: #495057;
        }
        .sidebar-link span {
          font-size: 0.79rem;
          font-weight: 500;
        }
        .sidebar-link:hover {
          background-color: rgba(233, 236, 239, 0.5);
          color: #495057;
        }
        .sidebar-link.active:hover {
          background-color: rgba(0, 112, 243, 0.12);
          color: #495057;
        }
      `}</style>
    </div>
  );
};

export default Sidebar; 