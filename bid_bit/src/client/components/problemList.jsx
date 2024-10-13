import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import ReactMarkdown from "react-markdown"; 
import Allocation from "../components/teamAllocation";

const statuses = {
  Complete: "text-green-700 bg-green-50 ring-green-600/20",
  "In progress": "text-gray-600 bg-gray-50 ring-gray-500/10",
  Archived: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
};

const initialProjects = [
  {
    id: 1,
    name: "GraphQL API",
    href: "#",
    status: "Complete",
    dueDate: "March 17, 2023",
    dueDateTime: "2023-03-17T00:00Z",
    difficulty: "Medium",
    description: "Implement a GraphQL API for our new service.",
    examples: "Example query: { user(id: 1) { name, email } }",
    tags: ["GraphQL", "API", "Backend"],
    testCases: {
      input: "query { user(id: 1) }",
      output: "{ user: { name: 'John', email: 'john@example.com' } }",
    },
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProblemManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [formData, setFormData] = useState({
    problemTitle: "",
    problemDifficulty: "easy",
    problemDescription: "",
    problemExamples: "",
    problemTags: "",
    testCaseInput: "",
    testCaseOutput: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProblem = {
      id: projects.length + 1,
      name: formData.problemTitle,
      href: "#",
      status: "In progress",
      createdBy: "Current User",
      dueDate: new Date().toLocaleDateString(),
      dueDateTime: new Date().toISOString(),
      difficulty: formData.problemDifficulty,
      description: formData.problemDescription,
      examples: formData.problemExamples,
      tags: formData.problemTags.split(",").map((tag) => tag.trim()),
      testCases: {
        input: formData.testCaseInput,
        output: formData.testCaseOutput,
      },
    };
    setProjects([...projects, newProblem]);
    setIsOpen(false);
    setFormData({
      problemTitle: "",
      problemDifficulty: "easy",
      problemDescription: "",
      problemExamples: "",
      problemTags: "",
      testCaseInput: "",
      testCaseOutput: "",
    });
  };

  const inputStyle =
    "border-2 border-gray-400 text-white h-10 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent";
  const textareaStyle =
    "border-2 border-gray-400 text-white h-20 px-5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent";

  return (
    <div
      className="mx-12 mt-10 max-w-6xl px-2 border-2 border-gray-400 rounded-xl sm:px-4 lg:px-8"
      style={{ backgroundColor: "#1e1e1e" }}
    >
      <div className="flex justify-between items-center mt-4 mb-4">
        <h2 className="text-3xl font-bold text-white">Problems</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-500 hover:bg-gray-700 mt-2 text-white font-bold py-2 px-4 rounded-full"
        >
          Create Question
        </button>
      </div>

      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex flex-col gap-y-2 py-5 border-b border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-lg font-semibold leading-6 text-white">
                    {project.name}
                  </p>
                  <p
                    className={classNames(
                      statuses[project.status],
                      "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {project.status}
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-400">
                  <p className="whitespace-nowrap">
                    Created on{" "}
                    <time dateTime={project.dueDateTime}>
                      {project.dueDate}
                    </time>
                  </p>
                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <p className="truncate">Created by {project.createdBy}</p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <a
                  href={project.href}
                  className="hidden rounded-md  px-2.5 py-1.5 text-sm font-semibold text-white shadow-s sm:block"
                >
                  <Allocation />
                </a>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-300">
              <p>
                <strong>Difficulty:</strong> {project.difficulty}
              </p>
              <p>
                <strong>Description:</strong>
                <ReactMarkdown className="prose prose-invert">
                  {project.description}
                </ReactMarkdown>
              </p>
              <p>
                <strong>Examples:</strong>
                <ReactMarkdown className="prose prose-invert">
                  {project.examples}
                </ReactMarkdown>
              </p>
              <p>
                <strong>Tags:</strong> {project.tags.join(", ")}
              </p>
              <p>
                <strong>Test Case:</strong>
              </p>
              <p className="ml-4">Input: {project.testCases.input}</p>
              <p className="ml-4">
                Expected Output: {project.testCases.output}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full min-w-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-xl transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all"
                  style={{ backgroundColor: "#1e1e1e" }}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white mb-4"
                  >
                    Create Question
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                      <div className="flex flex-col flex-grow">
                        <label
                          htmlFor="problemTitle"
                          className="text-white text-lg font-semibold mb-2"
                        >
                          Problem Title
                        </label>
                        <input
                          id="problemTitle"
                          type="text"
                          value={formData.problemTitle}
                          onChange={handleChange}
                          className={inputStyle}
                          style={{ backgroundColor: "#2e2e2e" }}
                        />
                      </div>
                      <div className="flex flex-col w-full sm:w-60">
                        <label
                          htmlFor="problemDifficulty"
                          className="text-white text-lg font-semibold mb-2"
                        >
                          Problem Difficulty
                        </label>
                        <select
                          id="problemDifficulty"
                          value={formData.problemDifficulty}
                          onChange={handleChange}
                          className={inputStyle}
                          style={{ backgroundColor: "#2e2e2e" }}
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <label
                        htmlFor="problemDescription"
                        className="text-white text-lg font-semibold mb-2"
                      >
                        Problem Description
                      </label>
                      <textarea
                        id="problemDescription"
                        value={formData.problemDescription}
                        onChange={handleChange}
                        className={textareaStyle}
                        style={{ backgroundColor: "#2e2e2e" }}
                      ></textarea>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <label
                        htmlFor="problemExamples"
                        className="text-white text-lg font-semibold mb-2"
                      >
                        Problem Examples
                      </label>
                      <textarea
                        id="problemExamples"
                        value={formData.problemExamples}
                        onChange={handleChange}
                        className={textareaStyle}
                        style={{ backgroundColor: "#2e2e2e" }}
                      ></textarea>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                      <div className="flex flex-col flex-grow">
                        <label
                          htmlFor="problemTags"
                          className="text-white text-lg font-semibold mb-2"
                        >
                          Problem Tags
                        </label>
                        <input
                          id="problemTags"
                          type="text"
                          value={formData.problemTags}
                          onChange={handleChange}
                          className="border-2 border-gray-400 text-white h-20 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          style={{ backgroundColor: "#2e2e2e" }}
                        />
                      </div>
                      <div className="flex flex-col w-full sm:w-120">
                        <label
                          htmlFor="testCase"
                          className="text-white text-lg font-semibold mb-2"
                        >
                          Test Case
                        </label>
                        <div className="flex flex-col space-y-2">
                          <input
                            id="testCaseInput"
                            type="text"
                            placeholder="input:"
                            value={formData.testCaseInput}
                            onChange={handleChange}
                            className={inputStyle}
                            style={{ backgroundColor: "#2e2e2e" }}
                          />
                          <input
                            id="testCaseOutput"
                            type="text"
                            placeholder="expectedOutput:"
                            value={formData.testCaseOutput}
                            onChange={handleChange}
                            className={inputStyle}
                            style={{ backgroundColor: "#2e2e2e" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      >
                        Submit Problem
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
