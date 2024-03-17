import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createLogger } from "redux-logger";
import codeEditor from "./slices/code-editor";
import contracts from "./slices/contracts";
import cortex from "./slices/cortex";

const loggerMiddleware = createLogger();

let middlewares = [] as any[];

if (process.env.NODE_ENV === "development") {
  middlewares = [...middlewares, loggerMiddleware];
} else {
  middlewares = [...middlewares];
}

export const store = configureStore({
  reducer: {
    codeEditor,
    contracts,
    cortex,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false }).concat(
      middlewares
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
