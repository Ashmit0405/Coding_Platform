import React from "react";
import { Controller } from "react-hook-form";
import Editor from "@monaco-editor/react";

export default function Texteditor({ name, control, label, language, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <Editor
            height="500px"
            defaultLanguage={language}    
            language={language}           
            value={value}
            onChange={(val) => onChange(val)}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
            }}
          />
        )}
      />
    </div>
  );
}
