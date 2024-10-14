import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Question = () => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/problems", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (response.data && response.data.length > 0) {
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
          <strong>Tags:</strong>{" "}
          {problem.tags ? problem.tags.join(", ") : "No tags available"}
        </div>
        <ReactMarkdown className="text-white text-xl mb-4">
          {problem.description}
        </ReactMarkdown>
        <div className="text-white mb-4">
          <strong>Difficulty:</strong> {problem.difficulty}
        </div>

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
            {problem.constraints.map((constraint, index) => (
              <li key={index}>
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
