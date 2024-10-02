// TaskSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from '../../type'; // Adjust the path as needed

const initialState = {
    tasks: [] as Task[],
};

const TaskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Omit<Task, 'id'>>) => {
            const { name, stageId } = action.payload;
            const newTask: Task = {
                id: Date.now(), // Consider using a UUID instead
                name,
                stageId,
            };
            state.tasks.push(newTask);
        },
        removeTask: (state, action: PayloadAction<number>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
        moveTask: (state, action: PayloadAction<{ taskId: number; sourceStageId: number; destStageId: number; destinationIndex: number }>) => {
            const { taskId, sourceStageId, destStageId, destinationIndex } = action.payload;
            const taskIndex = state.tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                const task = state.tasks[taskIndex];

                // Remove the task from its current position
                state.tasks.splice(taskIndex, 1);

                // Find the insertion index in the destination stage
                const insertIndex = state.tasks.findIndex(t => t.stageId === destStageId && t.id !== taskId);
                const newIndex = insertIndex === -1 ? state.tasks.length : insertIndex + destinationIndex;

                // Insert the task at the new position
                state.tasks.splice(newIndex, 0, { ...task, stageId: destStageId });
            }
        },
    },
});

export const { addTask, removeTask, moveTask } = TaskSlice.actions;
export default TaskSlice.reducer;
