import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowDown2 } from "iconsax-react";
import axios from "axios";

const statuses = {
  Complete: "text-green-700 bg-green-50 ring-green-600/20",
  "In progress": "text-gray-600 bg-gray-50 ring-gray-500/10",
  Archived: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProblemManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [problems, setProblems] = useState([]);
  const [expandedProblemId, setExpandedProblemId] = useState(null);
  const [formData, setFormData] = useState({
    problemTitle: "",
    problemDifficulty: "easy",
    problemDescription: "",
    problemExamples: "",
    problemTags: "",
    testCaseInput: "",
    testCaseOutput: "",
  });
  const [editData, setEditData] = useState({
    problemTitle: "",
    problemDescription: "",
    testCaseInput: "",
    testCaseOutput: "",
    teamName: "",
  });

  const dummyTeams = ["Team A", "Team B", "Team C"];

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.request({
          baseURL: import.meta.env.VITE_APP_SERVER_ADDRESS,
          url: `/api/problems`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!response.data) {
          throw new Error("Failed to fetch problems");
        }
        const data = response.data;
        console.log(data);
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Handle the edit submission logic here
  };

  const toggleExpand = (problemId) => {
    setExpandedProblemId(expandedProblemId === problemId ? null : problemId);
  };

  const openEditModal = (problem) => {
    setEditData({
      problemTitle: problem.title,
      problemDescription: problem.description,
      testCaseInput: problem.testCases?.[0]?.input || "",
      testCaseOutput: problem.testCases?.[0]?.expectedOutput || "",
      teamName: "",
    });
    setIsEditOpen(true);
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
        {problems.map((problem) => (
          <li
            key={problem._id}
            className="flex flex-col gap-y-2 py-5 border-b border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-lg font-semibold leading-6 text-white">
                    {problem.title || "Untitled Problem"}
                  </p>
                  <p
                    className={classNames(
                      statuses[problem.status] || statuses["In progress"],
                      "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                    )}
                  >
                    {problem.status || "In progress"}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-300">
                  {problem.description || "No description provided"}
                </p>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <button
                  onClick={() => toggleExpand(problem._id)}
                  className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-s"
                >
                  <ArrowDown2 size="20" color="white" />
                </button>
                <button
                  onClick={() => openEditModal(problem)}
                  className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-s"
                >
                  Edit
                </button>
              </div>
            </div>

            {expandedProblemId === problem._id && (
              <div className="mt-2 text-sm text-gray-300">
                <p>
                  <strong>Difficulty:</strong>{" "}
                  {problem.difficulty || "Not specified"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {problem.description || "No description provided"}
                </p>
                <p>
                  <strong>Tags:</strong>{" "}
                  {problem.tags ? problem.tags.join(", ") : "No tags"}
                </p>
                <p>
                  <strong>Example:</strong>
                </p>
                {problem.examples && problem.examples.length > 0 ? (
                  problem.examples.map((example, index) => (
                    <div key={index} className="ml-4 mb-2">
                      <p>{index + 1}. </p>
                      <p>Input: {example.input || "Not specified"}</p>
                      <p>Output: {example.output || "Not specified"}</p>
                      <p>
                        Explanation:{" "}
                        {example.explanation || "No explanation provided"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="ml-4">No examples provided</p>
                )}
                <p>
                  <strong>Testcases:</strong>
                </p>
                {problem.testCases && problem.testCases.length > 0 ? (
                  problem.testCases.map((testCase, index) => (
                    <div key={testCase._id || index} className="ml-4">
                      <p>Input: {testCase.input || "Not specified"}</p>
                      <p>
                        Expected Output:{" "}
                        {testCase.expectedOutput || "Not specified"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="ml-4">No test cases available</p>
                )}
              </div>
            )}
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

      <Transition appear show={isEditOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsEditOpen(false)}
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
                    Edit Question
                  </Dialog.Title>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="flex flex-col flex-grow">
                      <label
                        htmlFor="editProblemTitle"
                        className="text-white text-lg font-semibold mb-2"
                      >
                        Problem Title
                      </label>
                      <input
                        id="editProblemTitle"
                        type="text"
                        value={editData.problemTitle}
                        onChange={handleEditChange}
                        className={inputStyle}
                        style={{ backgroundColor: "#2e2e2e" }}
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <label
                        htmlFor="editProblemDescription"
                        className="text-white text-lg font-semibold mb-2"
                      >
                        Problem Description
                      </label>
                      <textarea
                        id="editProblemDescription"
                        value={editData.problemDescription}
                        onChange={handleEditChange}
                        className={textareaStyle}
                        style={{ backgroundColor: "#2e2e2e" }}
                      ></textarea>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                      <div className="flex flex-col flex-grow">
                        <label
                          htmlFor="editTestCaseInput"
                          className="text-white text-lg font-semibold mb-2"
                        >
                          Test Case Input
                        </label>
                        <input
                          id="editTestCaseInput"
                          type="text"
                          value={editData.testCaseInput}
                          onChange={handleEditChange}
                          className={inputStyle}
                          style={{ backgroundColor: "#2e2e2e" }}
                        />
                      </div>
                      <div className="flex flex-col flex-grow">
                        <label
                          htmlFor="editTestCaseOutput"
                          className="text-white text-lg font-semibold mb-2"
                        >
                          Test Case Output
                        </label>
                        <input
                          id="editTestCaseOutput"
                          type="text"
                          value={editData.testCaseOutput}
                          onChange={handleEditChange}
                          className={inputStyle}
                          style={{ backgroundColor: "#2e2e2e" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <label
                        htmlFor="editTeamName"
                        className="text-white text-lg font-semibold mb-2"
                      >
                        Team Name
                      </label>
                      <select
                        id="editTeamName"
                        value={editData.teamName}
                        onChange={handleEditChange}
                        className={inputStyle}
                        style={{ backgroundColor: "#2e2e2e" }}
                      >
                        {dummyTeams.map((team, index) => (
                          <option key={index} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px
-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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
