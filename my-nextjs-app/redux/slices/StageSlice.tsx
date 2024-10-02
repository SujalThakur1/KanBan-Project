

// Suggested changes to StageSlice.ts:

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, StageType } from "../../type"; // Adjust the path as needed

const initialState = {
    stages: [
        { id: 1727867582313, name: "To Do", tasks: [] },
        { id: 1727867582314, name: "In Progress", tasks: [] },
        { id: 1727867582315, name: "Done", tasks: [] },
    ] as StageType[],
};

const StageSlice = createSlice({
    name: "stages",
    initialState,
    reducers: {
        addStage: (state, action: PayloadAction<string>) => {
            const newStage: StageType = {
                id: Date.now(),
                name: action.payload,
                tasks: [],
            };
            state.stages.push(newStage);
        },
        removeStage: (state, action: PayloadAction<number>) => {
            state.stages = state.stages.filter(
                (stage) => stage.id !== action.payload
            );
        },
        renameStage: (
            state,
            action: PayloadAction<{ id: number; name: string }>
        ) => {
            const { id, name } = action.payload;
            const stage = state.stages.find((stage) => stage.id === id);
            if (stage) {
                stage.name = name;
            }
        },
        addTaskToStage: (
            state,
            action: PayloadAction<{ stageId: number; task: Task }>
        ) => {
            const { stageId, task } = action.payload;
            const stage = state.stages.find((stage) => stage.id === stageId);
            if (stage) {
                stage.tasks.push(task);
            }
        },
        reorderStages: (state, action: PayloadAction<number[]>) => {
            const newOrder = action.payload;
            const stageMap = new Map(state.stages.map(stage => [stage.id, stage]));
            state.stages = newOrder
                .map(id => stageMap.get(id))
                .filter((stage): stage is StageType => stage !== undefined);
        },
        // New reducer to update the tasks array of a stage
        updateStageTasks: (
            state,
            action: PayloadAction<{ stageId: number; tasks: Task[] }>
        ) => {
            const { stageId, tasks } = action.payload;
            const stage = state.stages.find((stage) => stage.id === stageId);
            if (stage) {
                stage.tasks = tasks;
            }
        },
    },
});

export const {
    addStage,
    removeStage,
    renameStage,
    addTaskToStage,
    reorderStages,
    updateStageTasks,
} = StageSlice.actions;
export default StageSlice.reducer;
