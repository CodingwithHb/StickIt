import React from "react";
import "../styles/Modal.scss";

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-btn">
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
