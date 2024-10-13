import React, { useState, useEffect } from "react";
import ProblemList from "../components/ProblemList";
import Leaderboard from "../components/Leaderboard";
import TeamInfo from "../components/TeamInfo";

export default function Home() {
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await fetch("/api/team");
        const data = await response.json();
        setTeamName(data.name);
      } catch (error) {
        console.error("Error fetching team name:", error);
      }
    };

    fetchTeamName();
  }, []);

  return (
    <div className="min-h-screen flex flex-col w-full dark:bg-black bg-white dark:bg-grid-small-white/[0.5] bg-grid-black/[0.2] overflow-hidden">
      <div className="header px-6 py-6">
        <h1 className="text-3xl text-white font-bold">
          Welcome Team {teamName}
        </h1>
      </div>
      <div className="content flex flex-1 flex-col md:flex-row gap-6 px-6">
        <ProblemList className="flex-1" />
        <TeamInfo className="flex-1" />
      </div>
      <div className="leaderboard px-6 py-4">
        <Leaderboard />
      </div>
    </div>
  );
}
