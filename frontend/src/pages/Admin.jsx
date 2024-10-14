import AdminProbList from "../components/AdminProbList";

export default function Admin() {
  return (
    <div className="min-h-screen  w-full dark:bg-black bg-white  dark:bg-grid-small-white/[0.5] bg-grid-black/[0.2]  ">
      <div className="text-4xl font-bold text-white sm:truncate sm:text-5xl sm:tracking-tight pt-10 ml-12">
        Admin
      </div>
      <AdminProbList />
    </div>
  );
}
