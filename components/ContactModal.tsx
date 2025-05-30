import React from 'react';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Contact Us</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="lock-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 11V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V11M7 11H17M7 11C5.89543 11 5 11.8954 5 13V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V13C19 11.8954 18.1046 11 17 11" stroke="#7B8794" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <p className="modal-message">
            Desthetik is currently in beta stage.
          </p>
          
          <div className="contact-email">
            <span>Email </span>
            <strong>contact@desthetik.com</strong>
            <span> for inquiries.</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1000;
        }
        
        .modal-container {
          position: fixed;
          top: 50%;
          left: 100px;
          transform: translateY(-50%);
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 200px;
          z-index: 1001;
          overflow: hidden;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
        }
        
        .modal-header h2 {
          margin: 0;
          font-size: 16px;
          color: #333;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #666;
          padding: 0;
          line-height: 1;
        }
        
        .modal-content {
          padding: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .lock-icon {
          margin-bottom: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          background-color: #f5f5f5;
          border-radius: 50%;
        }
        
        .modal-message {
          font-size: 14px;
          margin-bottom: 15px;
          color: #333;
        }
        
        .contact-email {
          font-size: 14px;
          color: #555;
          margin-bottom: 5px;
        }
        
        .contact-email strong {
          color: #000;
        }
      `}</style>
    </>
  );
};

export default ContactModal; 