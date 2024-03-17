import React, { FC } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputPromptProps, InputTypeEnum } from "./InputPrompt.types";

const VALID_INPUT_TYPES = ["address", "bytes32", "eth", "text"];

const InputPrompt: FC<InputPromptProps> = ({
  args,
  className,
  isLatest,
  onInputChange,
}) => {
  const [inputType, name] = args;

  if (!VALID_INPUT_TYPES.includes(inputType)) {
    return (
      <div className={className}>Unrecognized type: input / {inputType}</div>
    );
  }

  const onInput = (e: any) => onInputChange(name, e.target.value);

  switch (inputType) {
    case InputTypeEnum.ADDRESS:
      return <InputText placeholder="0x..." onInput={onInput} />;
    case InputTypeEnum.BYTES_32:
      return (
        <InputText
          placeholder="Enter bytes32 here"
          pattern="[0-9a-fA-F]"
          onInput={onInput}
        />
      );
    case InputTypeEnum.ETH:
      return (
        <InputNumber
          placeholder="0.01"
          mode="decimal"
          maxFractionDigits={3}
          onChange={(e) => {
            let value = e.value;
            if (name === "weth") {
              value = Number(e.value) * 10 ** 18;
            }
            onInputChange(name, value);
          }}
        />
      );
    case InputTypeEnum.TEXT:
      return <InputTextarea placeholder="Enter text here" onInput={onInput} />;
  }
};

export default InputPrompt;
