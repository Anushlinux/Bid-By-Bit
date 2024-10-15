import React from "react";
import CSILOGO from "../assets/CSILogo.svg"

const NavbarWithDock = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-transparent py-4 pt-6 z-10 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5">
        <div className="flex ml-3 items-center">
          <div className="-mr-2" color="white" />
          <img
            src={CSILOGO}
            alt="CSI Logo"
            className="mr-4"
            style={{ width: "40px", height: "40px" }}
          />
          <span className="text-white text-lg font-semibold">Bid By Bit</span>
          <span className="text-white text-xs">By CSI-KSKCE</span>
        </div>
      </div>
    </div>
  );
};

export default NavbarWithDock;
