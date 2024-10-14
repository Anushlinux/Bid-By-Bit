import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Dropdown from "../assets/dropdown";

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSubmit = async () => {
    console.log(JSON.stringify({ code, language: "python" }));
    try {
      const response = await axios.post(
        "http://localhost:4000/api/problems/6702a3e00e9792281a770be7/run",
        {
          code: code,
          language: "python",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      setOutput(
        `${response.data.successCount}/${response.data.total} test cases passed`,
      );
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("Error executing code");
    }
  };

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("myCustomTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {},
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    // Disable Ctrl+V using key codes 17 (Ctrl) and 86 (V)
    editor.onKeyDown((event) => {
      if (event.ctrlKey === 17 && event.keyCode === 86) {
        event.preventDefault();
      }
    });

    // Disable right-click paste
    editor.onDidPaste((event) => {
      event.preventDefault();
    });
  };

  return (
    <div>
      <div
        style={{
          width: "48vw",
          height: "calc(84vh)",
          marginLeft: "auto",
          marginTop: "6rem",
          borderRadius: "10px",
          border: "1px solid ",
          overflow: "hidden",
        }}
      >
        <div
          className="font-sans text-xl text-white py-2 px-4 "
          style={{ backgroundColor: "#2e2e2e" }}
        >
          <span className="text-green-500">{`</> `}</span>
          Code
        </div>
        <div className="px-2 " style={{ backgroundColor: "#1e1e1e" }}>
          <Dropdown />
        </div>
        <div className="h-0 w-full border-t border-gray-600"></div>
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
          beforeMount={handleEditorWillMount} // Called before the editor is mounted
          onMount={handleEditorDidMount}
        />
        <div className="bg-gray-100 p-4" style={{ backgroundColor: "#1e1e1e" }}>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Run Code
          </button>
        </div>
      </div>
      <div className="-mt-20">
        <h3 className="text-lg font-semibold text-white">Output:</h3>
        <pre
          className="bg-gray-100 text-white p-4 rounded-lg whitespace-pre-wrap"
          style={{ backgroundColor: "#1e1e1e" }}
        >
          {output}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
