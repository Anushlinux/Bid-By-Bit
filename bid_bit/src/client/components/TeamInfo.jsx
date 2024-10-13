export default function Component() {
  const teamMembers = [
    {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "Leader",
    },
    {
      name: "Bob Smith",
      email: "bob.smith@example.com",
      role: "Member",
    },
    {
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      role: "Member",
    },
    {
      name: "Dana White",
      email: "dana.white@example.com",
      role: "Member",
    },
  ];

  return (
    <div className="h-full bg-[#2e2e2e] text-white font-sans flex justify-center items-center rounded-lg">
      <main className="p-6 w-full max-w-7xl">
        <div className="flex flex-wrap gap-4 justify-center">
          <p className=" font-bold text-xl">Team Members</p>
          {teamMembers.map((team, index) => (
            <div
              key={index}
              className="bg-[#3e3e3e] p-4 rounded-lg flex flex-row justify-between w-full shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col justify-center">
                <h2 className="font-semibold text-gray-100">{team.name}</h2>
                <p className="text-xs text-gray-400">{team.email}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
