const LegalModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
      {/* Background Blur Overlay */}
      <div
        className="absolute inset-0 bg-earth-dark/60 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* The Note Bar / Modal Content */}
      <div className="relative bg-[#FDFCF0] w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl border border-sand p-8 md:p-12 font-serif">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-earth-dark hover:text-earth-light bg-transparent border-none cursor-pointer text-xl"
        >
          <i className="fas fa-times"></i>
        </button>

        <h2 className="text-3xl text-earth-dark italic mb-8 border-b border-sand pb-4">
          {title}
        </h2>

        <div className="text-gray-700 leading-relaxed space-y-6 font-sans text-sm md:text-base">
          {content}
        </div>

        <div className="mt-12 pt-6 border-t border-sand text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-earth-dark text-cream uppercase tracking-widest text-[10px] font-bold border-none cursor-pointer hover:bg-earth-medium transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
