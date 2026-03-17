import { QRCodeSVG } from "qrcode.react";

const MenuQRCode = () => {
  return (
    <div className="flex flex-col items-center p-8 bg-white/40 backdrop-blur-md border border-sand rounded-sm shadow-xl">
      <p className="text-[10px] uppercase tracking-[0.3em] text-earth-medium font-sans font-bold mb-4">
        Scan to Explore
      </p>

      <div className="p-4 bg-cream border border-sand rounded-sm">
        <QRCodeSVG
          value="https://l-olive-restaurant.vercel.app/menu"
          size={128}
          bgColor={"#f7f7e1"}
          fgColor={"#556b2f"}
          level={"H"}
          includeMargin={false}
        />
      </div>

      <p className="mt-4 text-[12px] italic text-earth-dark">
        The Digital Menu
      </p>
    </div>
  );
};

export default MenuQRCode;
