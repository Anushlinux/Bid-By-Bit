import React from "react";
import CodeEditor from "../components/codeEditor";
import Navbar from "../components/navbar";
import Question from "../components/question";

const code = () => {
  return (
    <div className="min-h-screen  w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative ">
      <Navbar />
      <div className="flex justify-end px-6 space-x-5">
        <Question />
        <CodeEditor />
      </div>
    </div>
  );
};

export default code;
