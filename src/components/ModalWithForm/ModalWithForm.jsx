import { useEffect } from "react";
import "./ModalWithForm.css";

export default function ModalWithForm({
  title,
  buttonText,
  isValid,
  isSubmitting,
  error,
  notice,
  footer,
  onSubmit,
  onClose,
  children,
}) {
  // Close on Escape.
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Close when the dark overlay (not the dialog) is clicked.
  function handleOverlayMouseDown(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="modal" onMouseDown={handleOverlayMouseDown}>
      <div
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="modal__close"
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="modal__title" id="modal-title">
          {title}
        </h2>
        <form className="modal__form" onSubmit={onSubmit} noValidate>
          {children}
          {notice && <p className="modal__notice">{notice}</p>}
          {error && (
            <p className="modal__error" role="alert">
              {error}
            </p>
          )}
          <button
            className="button button_solid modal__submit"
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Please wait" : buttonText}
          </button>
        </form>
        <p className="modal__footer">{footer}</p>
      </div>
    </div>
  );
}
