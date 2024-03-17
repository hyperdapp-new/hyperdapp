import { Moralis } from "moralis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { makeFlow } from "../../lib/flow";
import { Prompt } from "../../models/prompt-types";
import { TOAST_TXT } from "../../models/toast.models";

interface ICodeEditorSlice {
  loading: boolean;
  flow: any;
  prompts: any;
}

const initialState: ICodeEditorSlice = {
  loading: false,
  flow: undefined,
  prompts: [],
};

export const initFlow = createAsyncThunk(
  "codeEditor/initFlow",
  async ({ code, address }: { code: string; address: string | null }) => {
    try {
      if (!address) return;
      const flow = await makeFlow(code);
      const provider = await Moralis.enableWeb3();
      const signer = provider.getSigner();
      await flow.init(address.toLowerCase(), 10, { signer, provider });
      const prompts = (await flow.getPrompts()) as Prompt[];
      return { flow, prompts };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const executeFn = createAsyncThunk(
  "codeEditor/executeFn",
  async (action: any, { getState }) => {
    try {
      console.log("execute>", action);
      const { flow, prompts } = (getState() as any)
        .codeEditor as ICodeEditorSlice;

      const { effects } = await flow?.execute(action);
      console.log("effects>", effects);

      let effectPrompts: Prompt[] = [];

      for (let [effectType, ...effectArgs] of effects) {
        if (effectType === "log") {
          effectPrompts.push([effectType, ...effectArgs]);
        } else {
          console.log(`[effect/unrecognized-type]`, effectType, effectArgs);
        }
      }

      let newPrompts = await flow.getPrompts();
      if (effectPrompts.length) {
        newPrompts = effectPrompts.concat(newPrompts);
      }
      return [...prompts, newPrompts];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const handleInput = createAsyncThunk(
  "codeEditor/handleInput",
  async ({ name, value }: { name: string; value: string }, { getState }) => {
    try {
      const { flow, prompts } = (getState() as any)
        .codeEditor as ICodeEditorSlice;
      const accepted = await flow?.handleInput(name, value);
      if (!accepted) return [];

      // TODO: Write ui queue system to properly update browser input value
      console.log("acceptedValue", accepted.value);

      // Grab new prompts first so we can change array atomically
      const newPrompts = await flow.getPrompts();
      const oldPrompts = [...prompts];
      oldPrompts.pop();
      return [...oldPrompts, newPrompts];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

const codeEditor = createSlice({
  name: "code-editor",
  initialState,
  reducers: {
    resetCodeEditorState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initFlow.pending, (state, { payload }) => {
        state.loading = true;
        state.flow = undefined;
        state.prompts = [];
      })
      .addCase(initFlow.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.flow = payload?.flow;
        state.prompts = [payload?.prompts];
      })
      .addCase(initFlow.rejected, (state, { error }) => {
        state.loading = false;
        state.prompts = [
          [
            ["text", TOAST_TXT.ERROR_OCCURRED],
            ["text", error.message],
          ],
        ];
      })
      .addCase(executeFn.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.prompts = payload;
        console.log("prompts>", state.prompts[state.prompts.length - 1]);
      })
      .addCase(executeFn.rejected, (state, { error }) => {
        state.loading = false;
        state.prompts = [
          [
            ["text", TOAST_TXT.ERROR_OCCURRED],
            ["text", error.message],
          ],
        ];
        toast.error(TOAST_TXT.ERROR_OCCURRED, { theme: "colored" });
      })
      .addCase(handleInput.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.prompts = payload;
        console.log("prompts>", state.prompts[state.prompts.length - 1]);
      })
      .addCase(handleInput.rejected, (state, { error }) => {
        state.loading = false;
        state.prompts = [
          [
            ["text", TOAST_TXT.ERROR_OCCURRED],
            ["text", error.message],
          ],
        ];
      });
  },
});

const { actions, reducer } = codeEditor;
export const { resetCodeEditorState } = actions;
export default reducer;
