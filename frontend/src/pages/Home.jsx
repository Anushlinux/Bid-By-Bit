import { useEffect, useContext } from "react";
import ProblemList from "../components/ProblemList";
import Leaderboard from "../components/Leaderboard";

import UserDataContext from "../contexts/UserDataContext";

export default function Home() {
  const { userData } = useContext(UserDataContext);

  useEffect(() => {
    // Omit or comment the API fetch call for now
    // const fetchTeamData = async () => {
    //   try {
    //     const response = await fetch("/api/team");
    //     const data = await response.json();
    //     setTeamName(data.name);
    //     setTeamMembers(data.members);
    //   } catch (error) {
    //     console.error("Error fetching team data:", error);
    //   }
    // };
    // fetchTeamData();
  }, []);

  if (!userData) {
    return <></>;
  }

  return (
    <div className="min-h-screen flex flex-col w-full dark:bg-black bg-white dark:bg-grid-small-white/[0.5] bg-grid-black/[0.2] overflow-hidden">
      <div className="px-14 py-8">
        <p className="text-3xl text-white font-bold">
          Welcome {userData.team.name}
        </p>
        <p className="text-xl text-white">
          {userData.team.members.map((mem) => mem.name).join(", ")}
        </p>
      </div>
      <div className="flex flex-1 flex-col md:flex-row gap-20 px-6">
        <ProblemList />
        <Leaderboard />
      </div>
    </div>
  );
}
