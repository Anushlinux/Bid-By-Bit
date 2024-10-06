import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CloudUpload,
  AlignJustify,
} from "lucide-react";
import { Dock, DockIcon } from "../assets/dock"; // Assuming DockIcon is part of the Dock component

export type IconProps = React.HTMLAttributes<SVGElement>;

interface NavbarWithDockProps {
  onRunCode: () => void;
}

const NavbarWithDock: React.FC<NavbarWithDockProps> = ({ onRunCode }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-transparent py-4 pt-6 z-10 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5">
        <div className="flex ml-3 items-center">
          <AlignJustify className="mr-2" color="white" />
          <span className="text-white text-lg font-semibold">
            Bid By Bit
          </span>
        </div>
        <div className="absolute scale-95 left-1/2 transform -mt-9 -translate-x-1/2">
          <Dock
            magnification={60}
            distance={100}
            className="dock-custom-border"
          >
            <DockIcon className="bg-gray-500 p-3">
              <ChevronLeft className="size-full" />
            </DockIcon>
            <DockIcon className="bg-gray-500 p-3">
              <ChevronRight className="size-full" />
            </DockIcon>
            <DockIcon className="bg-orange-600 p-3" onClick={onRunCode}>
              <Play className="size-full" />
            </DockIcon>
            <DockIcon className="bg-green-500 p-3">
              <CloudUpload className="size-full" />
            </DockIcon>
          </Dock>
        </div>
      </div>
    </div>
  );
};

export default NavbarWithDock;
