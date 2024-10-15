import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Question = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get("/api/problems/" + id, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          baseURL: import.meta.env.VITE_APP_SERVER_ADDRESS,
        });

        if (response.data) {
          setProblem(response.data);
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
  }, [id]);

  if (loading) {
    return (
      <div
        className="mx-auto w-1/2 px-4 sm:px-6 lg:px-8 animate-pulse"
        style={{
          width: "50vw",
          height: "calc(87vh)",
          marginLeft: "auto",
          marginTop: "6rem",
          borderRadius: "10px",
          border: "1px solid ",
          backgroundColor: "#2e2e2e",
          overflow: "hidden",
        }}
      >
        <div
          className="mx-auto max-w-3xl py-3"
          style={{
            height: "100%",
            overflowY: "auto",
          }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 bg-gray-700 h-10 w-3/4"></h1>
          <div className="text-white mb-4 bg-gray-700 h-6 w-1/2"></div>
          <div className="text-white mb-4 bg-gray-700 h-40 w-full"></div>
          <div className="text-white mb-4 bg-gray-700 h-6 w-1/4"></div>
          <div className="text-white">
            <div className="bg-gray-700 h-6 w-1/2 mb-2"></div>
            <ul>
              <li className="bg-gray-700 h-6 w-full mb-2"></li>
              <li className="bg-gray-700 h-6 w-full mb-2"></li>
              <li className="bg-gray-700 h-6 w-full mb-2"></li>
            </ul>
            <ul>
              <li className="bg-gray-700 h-6 w-full mb-2"></li>
              <li className="bg-gray-700 h-6 w-full mb-2"></li>
              <li className="bg-gray-700 h-6 w-full mb-2"></li>
            </ul>
            <ul>
              <li className="bg-gray-700 h-6 w-full mb-2"></li>
              <li className="bg-gray-700 h-6 w-full mb-2"></li>
              <li className="bg-gray-700 h-6 w-full mb-2"></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;
  if (!problem) return <div>No problem found</div>;

  return (
    <div
      className="mx-auto w-1/2 px-4 sm:px-6 lg:px-8"
      style={{
        width: "50vw",
        height: "calc(87vh)",
        marginLeft: "auto",
        marginTop: "6rem",
        borderRadius: "10px",
        border: "1px solid ",
        backgroundColor: "#2e2e2e",
        overflow: "hidden",
      }}
    >
      <div
        className="mx-auto max-w-3xl py-3"
        style={{
          height: "100%",
          overflowY: "auto",
        }}
      >
        <h1 className="text-4xl font-bold text-white mb-4">{problem.title}</h1>
        <div className="text-white mb-4">
          <strong></strong>{" "}
          {problem.tags ? problem.tags.join(", ") : "No tags available"}
        </div>
        <ReactMarkdown className="text-white mb-4" remarkPlugins={[remarkGfm]}>
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
