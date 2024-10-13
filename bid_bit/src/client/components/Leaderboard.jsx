export default function Leaderboard() {
  const users = [
    {
      name: "18 ka Entertainment",
      points: 150,
    },
    {
      name: "Lonki",
      points: 120,
    },
    {
      name: "Bongali",
      points: 100,
    },
    {
      name: "noman",
      points: 80,
    },
    {
      name: "Diya didi",
      points: 60,
    },
  ];

  return (
    <div className="h-full bg-[#2e2e2e] text-white font-sans flex justify-center items-center rounded-lg">
      <main className="p-6 w-full max-w-7xl">
        <h1 className="text-center text-2xl font-bold mb-4">Leaderboard</h1>
        <div className="flex flex-wrap gap-4 justify-center">
          {users.map((user, index) => (
            <div
              key={index}
              className="bg-[#3e3e3e] p-4 rounded-lg flex flex-row justify-between w-full shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col justify-center">
                <h2 className="font-semibold text-gray-100">
                  #{index + 1} {user.name}
                </h2>
              </div>
              <div className="flex items-center m-2">
                <p className="text-sm font-bold text-gray-100">
                  {user.points} Points
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
