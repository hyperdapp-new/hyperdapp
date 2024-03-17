export enum PromptEnum {
  COL = "col",
  ROW = "row",
  BUTTON = "button",
  TEXT = "text",
  INPUT = "input",
  LOG = "log",
  DEBUG = "debug",
  IMAGE = "image",
}

export type Prompt = [PromptEnum, ...PromptArg[]];
export type PromptArg = Prompt | string | object;

export interface RenderPromptsParams {
  className: string;
  isLatest: boolean;
  prompts: PromptArg[];
  executeBtnAction(action: any[]): void;
  onInputChange(name: string, value: string): void;
}

export interface PromptsListProps {
  promptHistory: Prompt[][];
  executeBtnAction(action: any): void;
  onInputChange(name: string, value: string): void;
}
