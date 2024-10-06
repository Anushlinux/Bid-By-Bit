import React from "react";
import Editor from "@monaco-editor/react";
import Dropdown from "../assets/dropdown";

const App = () => {
  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
       
      },
    });
  };

  let ctrlKeyPressed = false;

  const handleEditorDidMount = (editor, monaco) => {
    editor.onKeyDown((e) => {
      if (e.keyCode === 5) {
        ctrlKeyPressed = true;
      }
      if (ctrlKeyPressed && e.keyCode === 52) {
        // 86 is the keyCode for 'V'
        console.log("Paste action prevented");
        e.preventDefault();
      }
    });
    editor.onKeyUp((e) => {
      if (e.keyCode === 52) {
        ctrlKeyPressed = false;
      }
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
          height="100%"
          width="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 20,
            minimap: {
              enabled: true,
            },
            contextmenu: false,
            padding: { top: 20, bottom: 20 },
          }}
          value={`**Code <>**\n\n`}
        />
      </div>
    </div>
  );
};

export default App;
