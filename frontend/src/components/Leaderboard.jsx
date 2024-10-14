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
    <div className="text-white w-1/3 min-h-full max-w-2xl divide-y divide-gray-700">
      <h1 className="text-start text-2xl pr-12 font-bold mb-4">Leaderboard</h1>
      {users.map((user, index) => (
        <div
          key={index}
          className="flex flex-row justify-between items-center py-4"
        >
          <h2 className="font-semibold text-gray-100 ">#{index + 1}</h2>
          <h2 className="text-center">{user.name}</h2>
          <h2 className="text-sm font-bold text-gray-100">
            {user.points} Points
          </h2>
        </div>
      ))}
    </div>
  );
}
