export interface Task {
    id: number;         // Unique identifier for the task
    name: string;      // The name or title of the task
    stageId: number;   // The ID of the stage this task is currently in
}

// Define the Stage type to include tasks
export interface StageType {
    id: number;
    name: string;
    tasks: Task[]; // Add an array of tasks
}
