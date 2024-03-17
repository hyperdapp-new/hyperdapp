export enum InputTypeEnum {
  ADDRESS = "address",
  BYTES_32 = "bytes32",
  ETH = "eth",
  TEXT = "text",
}

export type InputArgs = [InputTypeEnum, string];

export interface InputPromptProps {
  args: InputArgs;
  className: string;
  isLatest: boolean;
  onInputChange(name: string, value: any): void;
}
