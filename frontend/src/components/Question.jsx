import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // To support tables, task lists, etc.
import rehypeRaw from "rehype-raw"; // To handle raw HTML in markdown
import remarkBreaks from "remark-breaks"; // For handling line breaks '\n'

const Question = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/problems/" + id,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

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
          <strong>Tags:</strong>{" "}
          {problem.tags ? problem.tags.join(", ") : "No tags available"}
        </div>

        <ReactMarkdown
          className="prose prose-lg text-white mb-4" // Use Tailwind CSS's typography plugin or custom styles for markdown
          remarkPlugins={[remarkGfm, remarkBreaks]} // Enable GitHub flavored markdown and handle line breaks
          rehypePlugins={[rehypeRaw]} // Enable raw HTML parsing in markdown
        >
          {problem.description}
        </ReactMarkdown>

        <div className="text-white mb-4">
          <strong>Difficulty:</strong> {problem.difficulty}
        </div>

        <div className="text-white mb-4">
          <strong>Test Cases:</strong>
          {problem.testcases && problem.testcases.length > 0 ? (
            <ul>
              {problem.testcases.map((testCase, index) => (
                <li key={index}>
                  <strong>Input:</strong> {testCase.input},{" "}
                  <strong>Expected Output:</strong> {testCase.expectedOutput}
                </li>
              ))}
            </ul>
          ) : (
            <p>No test cases available</p>
          )}
        </div>

        <div className="text-white mb-4">
          <strong>Constraints:</strong>
          {problem.constraints && problem.constraints.length > 0 ? (
            <ul>
              {problem.constraints.map((constraint, index) => (
                <li key={index}>
                  {constraint.type}: {constraint.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No constraints available</p>
          )}
        </div>

        <div className="text-white mb-4">
          <strong>Examples:</strong>
          {problem.examples && problem.examples.length > 0 ? (
            <ul>
              {problem.examples.map((example, index) => (
                <li key={index}>
                  <strong>Example {index + 1}:</strong>
                  <ul>
                    <li>Input: {example.input}</li>
                    <li>Expected Output: {example.output}</li>
                    <li>Explanation: {example.explanation}</li>
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No examples available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
