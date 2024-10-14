import axios from "axios";
import { TickCircle } from "iconsax-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProblemList() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("/api/problems", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          baseURL: import.meta.env.VITE_APP_SERVER_ADDRESS,
        });
        setProblems(response.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="h-full text-white font-sans flex justify-center items-center rounded-lg">
      <main
        className="p-6 w-full max-w-7xl rounded-xl"
        style={{ backgroundColor: "#1e1e1e" }}
      >
        <div className="flex flex-wrap gap-4 justify-center">
          {problems.map((problem, index) => (
            <div
              key={index}
              className=" p-4 rounded-lg flex flex-row justify-between w-full shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ backgroundColor: "#2e2e2e" }}
            >
              <div className="flex flex-col justify-center">
                <h2 className="font-semibold text-gray-100">{problem.title}</h2>
                <p className="text-xs text-gray-400">{problem.difficulty}</p>
              </div>

              <div className="flex flex-col items-end m-2">
                {problem.solved ? (
                  <span className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm w-auto font-bold mb-1 ">
                    <TickCircle variant="Bold" className="w-4 h-4 mr-1" />{" "}
                    Solved
                  </span>
                ) : (
                  <Link
                    to={`/problem/${problem._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-bold px-4 py-2 rounded-lg text-sm mb-1 font-bold"
                  >
                    Solve Challenge
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
