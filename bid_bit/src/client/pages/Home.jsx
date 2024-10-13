import React from "react";
import ProblemList from "../components/ProblemList";
import Leaderboard from "../components/Leaderboard";
import TeamInfo from "../components/TeamInfo";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col w-full dark:bg-black bg-white dark:bg-grid-small-white/[0.5] bg-grid-black/[0.2] relative">
      <div>
        <h1 className="font-bold text-white">Hello</h1>
      </div>
      <div className="flex flex-row gap-4 p-10 space-x-5">
        <ProblemList />
        <div className="flex gap-4 flex-col space-y-5">
          <TeamInfo />
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
