import React from 'react';

import './Modal.css';

// Modal component for dialogs/popups with customizable title, content, and action buttons
const modal = props => (
  <div className="modal">
    {/* Modal header displays the title passed via props */}
    <header className="modal__header">
      <h1>{props.title}</h1>
    </header>

    {/* Modal content displays whatever is passed as children */}
    <section className="modal__content">{props.children}</section>

    {/* Modal actions section with optional Cancel and Confirm buttons */}
    <section className="modal__actions">
      {/* Render Cancel button only if canCancel prop is true */}
      {props.canCancel && (
        <button className="btn" onClick={props.onCancel}>
          Cancel
        </button>
      )}
      {/* Render Confirm button only if canConfirm prop is true */}
      {props.canConfirm && (
        <button className="btn" onClick={props.onConfirm}>
          {/* Button text is customizable via confirmText prop */}
          {props.confirmText}
        </button>
      )}
    </section>
  </div>
);

export default modal;
