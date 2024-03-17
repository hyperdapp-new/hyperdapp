import React, { ReactChild } from "react";
import { Image } from "primereact/image";
import { InputArgs } from "../components/InputPrompt/InputPrompt.types";
import { ButtonArgs } from "../components/ButtonPrompt/ButtonPrompt.types";
import { LogArgs } from "../components/LogPrompt/LogPrompt.types";
import { Prompt, PromptEnum, RenderPromptsParams } from "../PromptsList.types";
import RowPrompt from "../components/RowPrompt";
import ColPrompt from "../components/ColPrompt";
import TextPrompt from "../components/TextPrompt";
import InputPrompt from "../components/InputPrompt";
import ButtonPrompt from "../components/ButtonPrompt";
import LogPrompt from "../components/LogPrompt";

export const renderPrompts = (params: RenderPromptsParams): ReactChild[] => {
  const filtered = params.prompts.filter((p): p is Prompt => {
    const keep = typeof p !== "string";
    if (!keep) {
      console.warn(`[prompt/render] Ignoring prompt string:`, p);
    }
    return keep;
  });

  const { className, isLatest, executeBtnAction, onInputChange } = params;

  return filtered.map(([type, ...args], index) => {
    switch (type) {
      case PromptEnum.COL:
        return (
          <ColPrompt key={index} className={className}>
            {renderPrompts({ ...params, prompts: args }).map(
              (prompt, index) => (
                <div
                  key={index}
                  className="flex flex-1 items-center justify-center"
                >
                  {prompt}
                </div>
              )
            )}
          </ColPrompt>
        );
      case PromptEnum.ROW:
        return (
          <RowPrompt key={index} className={className}>
            {renderPrompts({ ...params, prompts: args }).map(
              (prompt, index) => (
                <div
                  key={index}
                  className="flex flex-1 items-center justify-center"
                >
                  {prompt}
                </div>
              )
            )}
          </RowPrompt>
        );
      case PromptEnum.TEXT:
        return <TextPrompt key={index} args={args} className={className} />;
      case PromptEnum.BUTTON:
        return (
          <ButtonPrompt
            key={index}
            args={args as ButtonArgs}
            className={className}
            isLatest={isLatest}
            executeBtnAction={executeBtnAction}
          />
        );
      case PromptEnum.INPUT:
        return (
          <InputPrompt
            key={index}
            args={args as InputArgs}
            className={className}
            isLatest={isLatest}
            onInputChange={onInputChange}
          />
        );
      case PromptEnum.IMAGE:
        let img = (args[0] as string).replaceAll("'", "");
        img = img.replace("ipfs://", "https://ipfs.io/ipfs/");
        return (
          <div className="p-4 border-2 rounded-md border-gray-600">
            <Image key={index} src={img} width="150px" alt="img" />
          </div>
        );
      case PromptEnum.LOG:
        const [, logTerm] = args;
        return (
          <LogPrompt key={index} args={args as LogArgs}>
            {renderPrompts({ ...params, prompts: [logTerm] })}
          </LogPrompt>
        );
      case PromptEnum.DEBUG:
        console.log(`[prompt/debug]`, ...args);
        return <></>;
      default:
        console.warn(`[prompt/unrecognized-type]`, type, args);
        return <div className={className}>Unrecognized type: {type}</div>;
    }
  });
};
