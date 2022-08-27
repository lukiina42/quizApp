import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/clike/clike";
import "codemirror/mode/python/python";
import { Controlled as ControlledEditor } from "react-codemirror2";
import "./index.css";

//The code editor which displays the text in editted form (color schemes based on language etc.) or enables teacher to
//write code into while creating the question
export default function Editor(props) {
  const { language, value, onChange, languageTypes } = props;

  //handles change of the text in the editor
  function handleChange(editor, data, value) {
    if (onChange) {
      onChange(value);
    }
  }

  //Returns the language in readable text for the user
  const getLanguage = () => {
    let languageText;
    switch (language) {
      case languageTypes.C:
        languageText = "C";
        break;
      case languageTypes.JAVA:
        languageText = "Java";
        break;
      case languageTypes.CPLUSPLUS:
        languageText = "C++";
        break;
      case languageTypes.PYTHON:
        languageText = "Python";
        break;
      default:
        languageText = language;
    }
    return languageText;
  };

  return (
    <div className={`editor-container`}>
      <div className="editor-title">Writing code in {getLanguage()}</div>
      <ControlledEditor
        onBeforeChange={handleChange}
        value={value}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          lineNumbers: true,
        }}
      />
    </div>
  );
}
