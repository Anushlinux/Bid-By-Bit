import CodeEditor from "../components/CodeEditor";
import Navbar from "../components/navbar";
import Question from "../components/Question";

const Problem = () => {
  return (
    <div className="min-h-screen  w-full dark:bg-black bg-white  dark:bg-grid-small-white/[0.5] bg-grid-black/[0.2] relative ">
      <Navbar />
      <div className="flex -mt-4 justify-end px-6 space-x-5">
        <Question />
        <CodeEditor />
      </div>
    </div>
  );
};

export default Problem;
