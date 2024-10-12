import { TickCircle } from "iconsax-react";

export default function Component() {
  const challenges = [
    {
      name: "Input and Output",
      difficulty: "Easy",
      solved: false,
    },
    {
      name: 'Say "Hello, World!" With C++',
      difficulty: "Easy",
      solved: true,
    },
    {
      name: "Basic Data Types",
      difficulty: "Easy",
      solved: false,
    },
    {
      name: "Conditional Statements",
      difficulty: "Easy",
      solved: false,
    },
    {
      name: "For Loop",
      difficulty: "Easy",
      solved: false,
    },
    {
      name: "Functions",
      difficulty: "Easy",
      solved: false,
    },
    {
      name: "Pointer",
      difficulty: "Easy",
      solved: false,
    },
    {
      name: "Arrays Introduction",
      difficulty: "Easy",
      solved: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#3e3e3e] text-white font-sans flex justify-center items-center rounded-lg">
      <main className="p-6 w-full max-w-7xl">
        <div className="flex flex-wrap gap-4 justify-center">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className="bg-[#2e2e2e] p-4 rounded-lg flex flex-row justify-between w-full shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col justify-center">
                <h2 className="font-semibold text-gray-100">
                  {challenge.name}
                </h2>
                <p className="text-xs text-gray-400">
                  {challenge.difficulty} (Basic)
                </p>
              </div>

              <div className="flex flex-col items-end m-2">
                {challenge.solved ? (
                  <span className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm w-auto font-bold mb-1">
                    <TickCircle variant="Bold" className="w-4 h-4 mr-1" />{" "}
                    Solved
                  </span>
                ) : (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-bold px-4 py-2 rounded-lg text-sm mb-1 font-bold">
                    Solve Challenge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
