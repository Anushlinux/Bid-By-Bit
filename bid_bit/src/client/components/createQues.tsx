import React, { useState } from "react";


const CreateQues = () => {
  const [formData, setFormData] = useState({
    problemTitle: "",
    problemDifficulty: "easy",
    problemDescription: "",
    problemExamples: "",
    problemTags: "",
    testCaseInput: "",
    testCaseOutput: "",
  });

  const handleChange = (e: { target: { id: any; value: any; }; }) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/submit-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Problem submitted successfully!");
        // Reset form or redirect user
      } else {
        alert("Failed to submit problem. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting problem:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const inputStyle =
    "border-2 border-gray-400 text-white h-10 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ";
  const textareaStyle =
    "border-2 border-gray-400 text-white h-20 px-5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="min-h-screen pb-10">
      <div className="text-xl pt-12 ml-12 font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Create Problems
      </div>
      <div
        className="mx-12 mt-10 max-w-6xl px-2 border-2 border-gray-400 rounded-xl sm:px-4 lg:px-8"
        style={{ backgroundColor: "#1e1e1e" }}
      >
        <div className="flex flex-col py-6 space-y-6">
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

          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-transparent hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit Problem
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateQues;
