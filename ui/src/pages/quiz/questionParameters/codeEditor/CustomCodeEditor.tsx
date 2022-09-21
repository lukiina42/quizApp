import React, { Dispatch, SetStateAction } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/clike/clike";
import "codemirror/mode/python/python";
import { Controlled as ControlledEditor } from "react-codemirror2";
import "./index.css";
import { LanguageType } from "../../../../common/types";

interface EditorProps {
  language: LanguageType,
  value: string,
  onChange?: (Dispatch<SetStateAction<string | undefined>>) | (() => void)
}

//The code editor which displays the text in editted form (color schemes based on language etc.) or enables teacher to
//write code into while creating the question
export default function Editor(props: EditorProps) {
  const { language, value, onChange } = props;

  //handles change of the text in the editor
  function handleChange(editor, data, value: string): void {
    if (onChange) {
      onChange(value);
    }
  }

  //Returns the language in readable text for the user
  const getLanguage = (language: LanguageType): string => {
    let languageText: string;
    switch (language) {
      case LanguageType.C:
        languageText = "C";
        break;
      case LanguageType.JAVA:
        languageText = "Java";
        break;
      case LanguageType.CPLUSPLUS:
        languageText = "C++";
        break;
      case LanguageType.PYTHON:
        languageText = "Python";
        break;
      default:
        languageText = language;
    }
    return languageText;
  };

  return (
    <div className={`editor-container`}>
      <div className="editor-title">Writing code in {getLanguage(language)}</div>
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
