import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Dropdown from "../components/Dropdown";
import TestCases from "../components/TestCases";
import { useParams } from "react-router-dom";

const CodeEditor = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState({});
  const [language, setLanguage] = useState(["C++", "cpp"]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  useEffect(() => {
    console.log("Language changed to:", language);
  }, [language]);

  const handleSubmit = async () => {
    console.log(JSON.stringify({ code, language: "python" }));
    try {
      const response = await axios.post(
        `http://localhost:4000/api/problems/${id}/run`,
        {
          code: code,
          language: language[1],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      setOutput(response.data);
      console.log(response.data);
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
          height: "calc(54vh)",
          marginLeft: "auto",
          marginTop: "6rem",
          borderRadius: "10px",
          border: "1px solid ",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          className="font-sans text-xl text-white py-2 px-4"
          style={{ backgroundColor: "#2e2e2e" }}
        >
          <span className="text-green-500">{`</> `}</span>
          Code
        </div>
        <div className="px-2" style={{ backgroundColor: "#1e1e1e" }}>
          <Dropdown language={language} setLanguage={setLanguage} />
        </div>
        <div className="h-0 w-full border-t border-gray-600"></div>
        <Editor
          height="400px"
          language={language[1]}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
          }}
        >
          <button
            onClick={handleSubmit}
            className="run-code-button mr-2 text-white px-4 py-2 rounded hover:bg-blue-600"
            style={{ backgroundColor: "#2e2e2e" }}
          >
            Run Code
          </button>
        </div>
      </div>
      <div className="mt-2">
        <div className="text-lg font-semibold text-white">
          <TestCases />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
