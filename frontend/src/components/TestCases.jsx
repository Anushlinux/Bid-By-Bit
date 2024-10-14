import React, { useState, useEffect } from "react";
import { TickSquare, CloseCircle } from "iconsax-react";
import axios from "axios"; // Make sure you have imported axios

const TestCases = () => {
  const [selectedCase, setSelectedCase] = useState(null);
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

  const handleCaseClick = (caseId, testCase) => {
    setSelectedCase(testCase);
  };

  const handleClose = () => {
    setSelectedCase(null);
  };

  return (
    <div
      className="overflow-hidden rounded-lg shadow"
      style={{ backgroundColor: "#1e1e1e", height: "225px" }}
    >
      <div className="h-full overflow-y-auto">
        <div className="flex justify-start px-4 py-5">
          <div className="text-green-600">
            <TickSquare />
          </div>
          <span className="-mt-1 px-2 text-white">Testcase</span>
        </div>
        {!selectedCase && (
          <div className="flex justify-normal px-4">
            <div className="text-green-600 text-3xl font-medium">Accepted</div>
            <span className="text-gray-500 text-lg ml-6 mt-2">
              Runtime: 45ms
            </span>
          </div>
        )}
        <div className="mt-4 px-4 pb-4">
          {selectedCase ? (
            <div className="text-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  Test Case {selectedCase.id}
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white"
                >
                  <CloseCircle size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Input:</strong> {selectedCase.input}
                </p>
                <p>
                  <strong>Output:</strong> {selectedCase.output}
                </p>
                <p>
                  <strong>Expected:</strong> {selectedCase.expectedOutput}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {problems.map((problem, index) =>
                problem.testCases.map((testCase, tcIndex) => (
                  <button
                    key={`${index}-${tcIndex}`}
                    onClick={() => handleCaseClick(tcIndex, testCase)}
                    className="flex justify-between items-center w-full px-4 py-2 text-white bg-gray-800 rounded-lg shadow-md hover:bg-gray-700"
                    style={{ backgroundColor: "#2e2e2e" }}
                  >
                    <span>Test Case {tcIndex + 1}</span>
                    <span className="text-green-400">Passed</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCases;
