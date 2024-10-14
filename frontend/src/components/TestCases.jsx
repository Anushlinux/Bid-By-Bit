import React, { useState } from "react";
import { TickSquare, CloseCircle } from "iconsax-react";

const TestCases = () => {
  const [selectedCase, setSelectedCase] = useState(null);

  const testCases = [
    {
      id: 1,
      input: "Input for Test Case 1",
      output: "Output for Test Case 1",
      expected: "Expected Output for Test Case 1",
    },
    {
      id: 2,
      input: "Input for Test Case 2",
      output: "Output for Test Case 2",
      expected: "Expected Output for Test Case 2",
    },
    {
      id: 3,
      input: "Input for Test Case 3",
      output: "Output for Test Case 3",
      expected: "Expected Output for Test Case 3",
    },
    {
      id: 4,
      input: "Input for Test Case 4",
      output: "Output for Test Case 4",
      expected: "Expected Output for Test Case 4",
    },
  ];

  const handleCaseClick = (caseId) => {
    setSelectedCase(testCases.find((tc) => tc.id === caseId));
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
                  <strong>Expected:</strong> {selectedCase.expected}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {testCases.map((testCase) => (
                <button
                  key={testCase.id}
                  onClick={() => handleCaseClick(testCase.id)}
                  className="flex justify-between items-center w-full px-4 py-2 text-white bg-gray-800 rounded-lg shadow-md hover:bg-gray-700"
                  style={{ backgroundColor: "#2e2e2e" }}
                >
                  <span>Test Case {testCase.id}</span>
                  <span className="text-green-400">Passed</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCases;
