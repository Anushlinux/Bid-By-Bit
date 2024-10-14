import { AlignJustify } from "lucide-react";

const NavbarWithDock = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-transparent py-4 pt-6 z-10 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5">
        <div className="flex ml-3 items-center">
          <AlignJustify className="mr-2" color="white" />
          <span className="text-white text-lg font-semibold">Bid By Bit</span>
        </div>
      </div>
    </div>
  );
};

export default NavbarWithDock;
