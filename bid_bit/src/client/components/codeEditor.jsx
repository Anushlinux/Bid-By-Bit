import React from "react";
import Editor from "@monaco-editor/react";

const App = () => {
  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#000000",
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
    <div
      className="flex justify-end min-h-screen bg-black"
      style={{
        padding: "0rem 0",
        backgroundColor: "",
      }}
    >
      <div
        style={{
          width: "50vw",
          height: "calc(84vh - 1rem)",
          marginLeft: "auto",
          marginTop: "3.5rem",
          borderRadius: "10px",
          border: "1px solid #FF0000",
          overflow: "hidden",
        }}
      >
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: {
              enabled: true,
            },
            contextmenu: false,
            padding: { top: 20, bottom: 20 },
          }}
        />
      </div>
    </div>
  );
};

export default App;
