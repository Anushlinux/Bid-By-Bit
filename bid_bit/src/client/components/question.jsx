import React, { useState, useEffect } from "react";
import axios from "axios";

const Question = () => {
  const [problem, setProblem] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Set true by default
  const [error, setError] = useState(null); // Initialize as null

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/problems", {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        console.log(response.data);

        if (response.data && response.data.length > 0) {
          // Assuming you want to fetch the first problem in the array
          setProblem(response.data[0]);
        } else {
          setProblem(null);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError("Error fetching problem");
        setLoading(false);
      }
    };

    fetchProblem();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!problem) return <div>No problem found</div>;

  return (
    <div
      className="mx-auto w-1/2 px-4 sm:px-6 lg:px-8"
      style={{
        width: "50vw",
        height: "calc(84vh)",
        marginLeft: "auto",
        marginTop: "6rem",
        borderRadius: "10px",
        border: "1px solid ",
        overflow: "hidden",
        backgroundColor: "#2e2e2e",
      }}
    >
      <div className="mx-auto max-w-3xl mt-3">
        <h1 className="text-4xl font-bold text-white mb-4">{problem.title}</h1>
        <div className="text-white mb-4">
          <strong></strong>{" "}
          {problem.tags ? problem.tags.join(", ") : "No tags available"}
        </div>
        <p className="text-white text-xl mb-4">{problem.description}</p>
        <div className="text-white mb-4">
          <strong>Difficulty:</strong> {problem.difficulty}
        </div>

        {/* Check if tags exist before rendering */}

        {/* Check if testcases exist before rendering */}
        <div className="text-white">
          <strong>Test Cases:</strong>
          {problem.testcases && problem.testcases.length > 0 ? (
            <ul>
              {problem.testcases.map((testCase, index) => (
                <li key={index}>
                  Input: {testCase.input}, Expected Output:{" "}
                  {testCase.expectedOutput}
                </li>
              ))}
            </ul>
          ) : (
            <p>No test cases available</p>
          )}
          <ul>
            {problem.constraints.map((constraint, type) => (
              <li key={type}>
                {constraint.type}: {constraint.description}
              </li>
            ))}
          </ul>
          <ul>
            {problem.examples.map((example, index) => (
              <li key={index}>
                Example {index + 1}: <span>Input:</span>
                <span>{example.input},</span>
                <span>
                  <ul>Expected Output: {example.output}</ul>
                </span>
                <span>
                  <ul>Explanation: {example.explanation}</ul>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Question;
