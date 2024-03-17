import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchContractABI } from "../../services/fetch-abi.service";
import { ContractMethodModel } from "../../models/contract-method.models";

interface ContractMethodMap {
  [methodName: string]: ContractMethodModel;
}

interface IContractSlice {
  codeEditor: {
    [contractName: string]: {
      arr: ContractMethodModel[];
      map: ContractMethodMap;
    };
  };
  flowEditor: {
    [contractAddress: string]: {
      isLoading: boolean;
      name: string;
      methods: {
        arr: ContractMethodModel[];
        map: ContractMethodMap;
      };
    };
  };
}

const initialState: IContractSlice = {
  codeEditor: {},
  flowEditor: {},
};

export const getContractABI = createAsyncThunk(
  "contracts/getContractABI",
  async (payload: { chainId: string; name: string; address: string }) => {
    try {
      const { chainId, address } = payload;
      const data = await fetchContractABI(chainId, address);
      let arr: ContractMethodModel[] = [];

      if ("OK" === data.message) arr = JSON.parse(data.result);

      const map: ContractMethodMap = {};

      arr.forEach((fn) => {
        const key = fn.type !== "constructor" ? fn.name : "constructor";
        map[key] = fn;
      });

      return { arr, map };
    } catch (error) {}
  }
);

const contracts = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    setContractABI(state, { payload }) {
      const { name, abi: arr } = payload;
      const map: ContractMethodMap = {};
      arr.forEach((fn: ContractMethodModel) => {
        const key = fn.type !== "constructor" ? fn.name : "constructor";
        map[key] = fn;
      });
      state.codeEditor[name] = { arr, map };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContractABI.pending, (state, action) => {
        const { name, address } = action.meta.arg;
        state.flowEditor[address] = {
          isLoading: true,
          methods: { arr: [], map: {} },
          name,
        };
      })
      .addCase(getContractABI.fulfilled, (state, action) => {
        if (!action.payload) return;
        const { name, address } = action.meta.arg;
        const { arr, map } = action.payload;
        state.flowEditor[address] = {
          isLoading: false,
          methods: { arr, map },
          name,
        };
      });
  },
});

const { actions, reducer } = contracts;
export const { setContractABI } = actions;
export default reducer;
