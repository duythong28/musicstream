import { X } from "lucide-react";
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-75 sm:bg-opacity-75"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-dark-secondary rounded-lg w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-dark-tertiary sticky top-0 bg-dark-secondary z-10">
          <h2 className="text-xl sm:text-2xl font-bold truncate pr-4">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-2 -m-2 touch-manipulation"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
