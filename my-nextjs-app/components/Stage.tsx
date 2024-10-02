import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../redux/slices/TaskSlice";
import { StageType } from "../type";
import { RootState } from "../redux/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Props for the Stage component
type StageProps = {
  stage: StageType;
  maxHeight: number;
  onHeightChange: (newHeight: number) => void;
};

const Stage: React.FC<StageProps> = ({
  stage,
  maxHeight,
  onHeightChange,
}) => {

  const dispatch = useDispatch();
  const [newTaskName, setNewTaskName] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const bg = "bg-neutral-800";
  const bgCard = "bg-neutral-700";

  // Memoize the selector function
  const selectStageTasks = useMemo(() => {
    return (state: RootState) => {
      const tasks = state.tasks.tasks.filter((task) => task.stageId === stage.id);
      return tasks;
    };
  }, [stage.id]);

  // Get tasks for this stage from Redux store using memoized selector
  const stageTasks = useSelector(selectStageTasks, (prev, next) => {
    if (prev.length !== next.length) return false;
    for (let i = 0; i < prev.length; i++) {
      if (prev[i] !== next[i]) return false;
    }
    return true;
  });

  // Add a new task
  const handleAddTask = () => {
    if (newTaskName.trim()) {
      dispatch(addTask({ name: newTaskName.trim(), stageId: stage.id }));
      setNewTaskName("");
      setIsAddingTask(false);
    }
  };

  // Update stage height when content changes
  useEffect(() => {
    const updateHeight = () => {
      if (stageRef.current) {
        const newHeight = stageRef.current.scrollHeight;
        onHeightChange(newHeight);
      }
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (stageRef.current) resizeObserver.observe(stageRef.current);

    return () => {
      if (stageRef.current) resizeObserver.unobserve(stageRef.current);
    };
  }, [stageTasks, isAddingTask, newTaskName, onHeightChange]);

  // Auto-focus input when adding task
  useEffect(() => {
    if (isAddingTask && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingTask]);

  // Capitalize first letter of input
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  

  return (
    <div
      ref={stageRef}
      className={`text-white mb-4 rounded-4 ${bg} text-center p-3 pt-0 transition-all duration-300`}
      style={{
        width: "300px",
        minHeight: `${maxHeight}px`,
        fontFamily: "'Inter', sans-serif",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="sticky top-0 bg-inherit z-10 pt-3 pb-1">
        <h3 className="font-bold text-xl mb-3">{stage.name}</h3>
      </div>
      <div className='text-left flex-grow '>
        {stageTasks.map((task) => (
          <div
            key={task.id}
            className={`break-words p-2 mb-2 ${bgCard} rounded`}
          >
            {task.name}
          </div>
        ))}
      </div>
      <div className="mt-auto">
        {isAddingTask ? (
          <div>
            <Textarea
              ref={inputRef}
              value={newTaskName}
              onChange={(e) =>
                setNewTaskName(capitalizeFirstLetter(e.target.value))
              }
              placeholder="Enter task"
              className="w-full resize-none overflow-y-auto break-words"
            />
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                onClick={handleAddTask}
                className="mr-2 hover:bg-neutral-500"
              >
                ✓
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-neutral-500"
                onClick={() => setIsAddingTask(false)}
              >
                ✗
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setIsAddingTask(true)}
            className="fw-bolder w-full hover:bg-neutral-500"
          >
            {isHovering ? "+ Add task" : "\u00A0"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Stage;
