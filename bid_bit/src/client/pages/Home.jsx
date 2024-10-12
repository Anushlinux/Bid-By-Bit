import React from "react";
import ProblemList from "../components/ProblemList";

export default function Home() {
  return (
    <div className="min-h-screen w-full dark:bg-black bg-white  dark:bg-grid-small-white/[0.5] bg-grid-black/[0.2] relative ">
      <div className="p-10">
        <ProblemList />
      </div>
    </div>
  );
}
