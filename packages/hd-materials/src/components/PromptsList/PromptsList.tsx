import React, { FC } from "react";
import { PromptsListProps } from "./PromptsList.types";
import { renderPrompts } from "./helpers/renderPrompts";

const PromptsList: FC<PromptsListProps> = ({
  promptHistory,
  executeBtnAction,
  onInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 divide-y divide-gray-300">
      {promptHistory.map((prompts, index: number) => (
        <div key={index} className="flex flex-col gap-4 items-center">
          {renderPrompts({
            prompts,
            executeBtnAction,
            onInputChange,
            className: "",
            isLatest: index === prompts.length - 1,
          })}
        </div>
      ))}
    </div>
  );
};

export default PromptsList;
