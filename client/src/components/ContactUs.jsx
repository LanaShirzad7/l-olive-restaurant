const ContactUs = () => {
  return (
    <div className="bg-cream min-h-screen pt-32 pb-20 font-serif">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-earth-medium uppercase tracking-[0.3em] text-xs font-sans font-bold mb-4 block">
          Get in Touch
        </span>
        <h1 className="text-5xl md:text-6xl text-earth-dark italic mb-8">
          Contact Our Kitchen
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 text-left">
          {/* Contact Details */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl text-earth-dark italic border-b border-sand pb-2 mb-4">
                Location
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Komitas, Nikoghayos Tigranyan 10
                <br />
                Armenia, Yerevan 0045
              </p>
            </div>
            <div>
              <h3 className="text-xl text-earth-dark italic border-b border-sand pb-2 mb-4">
                Hours
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Mon - Fri: 11am — 10pm
                <br />
                Sat - Sun: 9am — 11pm
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/40 backdrop-blur-md p-8 shadow-2xl border border-sand">
            <form className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-earth-dark font-sans font-bold mb-2">
                  Message
                </label>
                <textarea
                  rows="4"
                  className="w-full bg-transparent border-b border-earth-dark/20 py-2 outline-none focus:border-earth-medium text-earth-dark resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button className="w-full py-4 bg-earth-dark text-cream hover:bg-earth-medium transition-all uppercase tracking-widest text-xs font-sans font-bold cursor-pointer border-none shadow-lg">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
