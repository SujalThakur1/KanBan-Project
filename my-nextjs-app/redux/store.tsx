import { configureStore } from "@reduxjs/toolkit";
import StageSlice from "./slices/StageSlice";
import TaskSlice from "./slices/TaskSlice";

export const Store = configureStore({
    reducer:{
        stages: StageSlice,
        tasks: TaskSlice
    }
})

// Define the RootState type
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
