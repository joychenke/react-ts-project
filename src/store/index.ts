import { configureStore } from "@reduxjs/toolkit";
import { projectListSlice } from "screens/project-list/project-list.slice";
import { authSlice } from "./auth.slice";

export const rootReducer = {
  projectList: projectListSlice.reducer,
  auth: authSlice.reducer,
};
export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

// getState函数返回S，S代表整个state树，typeof将store.getState转化为ts的类型，得到一个ts的函数类型，ReturnType传入函数，得到函数的返回值类型。以上整合下，ReturnType得到的是S的类型，即整个state的类型
export type RootState = ReturnType<typeof store.getState>;
