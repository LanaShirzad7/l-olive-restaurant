const SanctuaryAccess = () => {
  return (
    <div className="fixed inset-0 z-[200] bg-[#3D4828] flex flex-col items-center justify-center font-serif text-[#F5F5DC]">
      {/* Decorative Watermark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className="text-[50vh] opacity-5 italic select-none">O</span>
      </div>

      <div className="relative z-10 text-center space-y-8 animate-in fade-in duration-1000">
        <div className="flex justify-center">
          <i className="fas fa-leaf text-4xl animate-pulse text-earth-medium"></i>
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl italic tracking-wide">
            Preparing Your Sanctuary
          </h2>
          <p className="text-[10px] uppercase tracking-[0.4em] font-sans opacity-40">
            Setting the table for your arrival
          </p>
        </div>

        {/* Elegant Loading Line */}
        <div className="w-48 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-earth-medium animate-loading-line"></div>
        </div>
      </div>

      {/* Tailwind Style needed for the line (Add to your index.css or a style tag) */}
      <style>{`
        @keyframes loading-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-line {
          animation: loading-line 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default SanctuaryAccess;
