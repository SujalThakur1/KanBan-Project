"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStage } from "../redux/slices/StageSlice";
import Stage from "./Stage";
import { RootState } from "../redux/store";
import { StageType } from "../type";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Stages() {
  const dispatch = useDispatch();
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [maxHeight, setMaxHeight] = useState(200);
  const [containerHeight, setContainerHeight] = useState("100%");

  // Get stages from Redux store
  const stages = useSelector((state: RootState) => state.stages.stages);

  // Handle saving a new stage
  const handleSaveStage = () => {
    if (newStageName.trim()) {
      dispatch(addStage(newStageName.trim()));
      setNewStageName("");
      setIsAddingStage(false);
    }
  };
  // Function to scroll to the top
  const scrollToPosition = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Effect to scroll when isAddingStage becomes true
  useEffect(() => {
    if (isAddingStage) {
      // Scroll to the right with smooth animation
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 300);
        scrollToPosition();
      });
    }
  }, [isAddingStage]);

  

  // Update container height on window resize
  useEffect(() => {
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const containerTop =
        scrollContainerRef.current?.getBoundingClientRect().top || 0;
      const remainingHeight = windowHeight - containerTop;
      setContainerHeight(`${remainingHeight}px`);
    };

    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);
    return () => window.removeEventListener("resize", updateContainerHeight);
  }, []);

  // Capitalize first letter of input
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Handle key press for adding stage
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveStage();
    }
  };

  return (
    <div className="relative bg-inherit">
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-auto rounded-md m-2 sm:m-4 md:m-6 lg:m-10 mb-0 flex space-x-2"
        style={{
          scrollbarWidth: "thin",
          height: containerHeight,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Render existing stages */}
        {stages.map((stage: StageType, index: number) => (
          <div
            key={stage.id}
            className="flex-shrink-0"
            style={{ width: "300px" }}
          >
            <div
              className="flex flex-col h-full"
              style={{ height: containerHeight }}
            >
              <div className="overflow-y-visible flex-grow">
                <Stage
                  stage={stage}
                  maxHeight={maxHeight}
                  onHeightChange={(newHeight: number) =>
                    setMaxHeight(Math.max(maxHeight, newHeight))
                  }
                />
              </div>
            </div>
          </div>
        ))}

        {/* Render new stage input when adding */}
        {isAddingStage && (
          <div
            className="col-lg-3 col-md-4 col-sm-6 mr-4 ml-4 bg-neutral-800 p-4 pt-3 text-white rounded-4"
            style={{ width: "300px", height: maxHeight }}
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder="Stage Name"
              value={newStageName}
              onChange={(e) =>
                setNewStageName(capitalizeFirstLetter(e.target.value))
              }
              onKeyPress={handleKeyPress}
              className="form-control me-14 text-white focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            />
            <div className="btn-group mt-2 flex justify-end">
              <Button
                variant="ghost"
                onClick={handleSaveStage}
                className="mr-2 hover:bg-neutral-500"
              >
                ✓
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-neutral-500"
                onClick={() => setIsAddingStage(false)}
              >
                ✗
              </Button>
            </div>
          </div>
        )}

        {/* Render add stage button when not adding */}
        {!isAddingStage && (
            <div className="sticky top-0 bg-inherit">
              <button
                onClick={() => setIsAddingStage(true)}
                className="bg-neutral-600 text-white rounded-full p-3 mt-2 mr-4 ml-2 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                <FaPlus className="text-3xl" />
              </button>
            </div>
        )}
      </div>
    </div>
  );
}

export default Stages;
