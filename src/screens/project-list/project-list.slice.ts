import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

// 专门管理project-list状态的切片
interface State {
  projectModalOpen: boolean;
}
const initialState: State = {
  projectModalOpen: false,
};

export const projectListSlice = createSlice({
  name: "projectListSlice",
  initialState,
  reducers: {
    openPrjectModal(state) {
      // 能够直接修改state上的属性，是因为immer帮忙处理了
      state.projectModalOpen = true;
    },
    closeProjectModal(state) {
      state.projectModalOpen = false;
    },
  },
});

// projectListActions 的类型是上面定义的openPrjectModal()等，一个个的方法
export const projectListActions = projectListSlice.actions;

export const selectProjectModalOpen = (state: RootState) =>
  state.projectList.projectModalOpen;
