import { useState, useEffect } from "react";
import { TickSquare, CloseCircle } from "iconsax-react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TestCases = ({ output }) => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [problem, setProblem] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`/api/problems/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          baseURL: import.meta.env.VITE_APP_SERVER_ADDRESS,
        });
        setProblem(response.data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchProblem();
  }, [id]);

  const handleCaseClick = (testCaseId, index) => {
    const selectedTestCase = problem.testCases.find(
      (tc) => tc._id === testCaseId,
    );
    setSelectedCase({ ...selectedTestCase, index });
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
        <div className="flex justify-start items-center px-4 py-5">
          <div className="text-green-600">
            <TickSquare />
          </div>
          <span className="-mt-1 px-2 text-white">Testcases</span>
        </div>
        {!selectedCase && (
          <div className="flex justify-normal px-4">
            {output && output.submission && (
              <div
                className={`${output.accepted ? "text-green-600" : "text-red-600"} text-3xl font-medium`}
              >
                {output.accepted ? "Accepted" : "Failed"}
              </div>
            )}
            {output && (
              <span className="text-gray-500 text-lg ml-6 mt-2">
                Runtime: {output.runtime / 1000}s
              </span>
            )}
          </div>
        )}
        <div className="mt-4 px-4 pb-4">
          {selectedCase ? (
            <div className="text-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  Test Case {selectedCase.index + 1}
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
                  <strong>Output:</strong>{" "}
                  {output ? output.data[selectedCase.index].output : "N/A"}
                </p>
                <p>
                  <strong>Expected:</strong> {selectedCase.expectedOutput}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {problem?.testCases && problem.testCases.length > 0 ? (
                problem.testCases.map((testCase, index) => (
                  <button
                    key={testCase._id}
                    onClick={() => handleCaseClick(testCase._id, index)}
                    className="flex justify-between items-center w-full px-4 py-2 text-white bg-gray-800 rounded-lg shadow-md hover:bg-gray-700"
                    style={{ backgroundColor: "#2e2e2e" }}
                  >
                    <span>Test Case {index + 1}</span>

                    {output ? (
                      output.data[index].successful ? (
                        <span className="text-green-400">Passed</span>
                      ) : (
                        <span className="text-red-400">Failed</span>
                      )
                    ) : (
                      ""
                    )}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No test cases available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCases;
