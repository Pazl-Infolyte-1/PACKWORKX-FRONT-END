import React, { useState } from 'react';

const ProductionStagesTimeline = ({ workOrder, handleProgressChange }) => {
  const [draggedOver, setDraggedOver] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const renderProductionStages = (currentProgress) => {
    const stages = [
      { name: "Pending", value: "Pending" },
      { name: "Raw Material Allocation", value: "Raw Meterial Allocation" }, // Keep original typo for compatibility
      { name: "Procurement Sourcing", value: "Procurement Sourcing" },
      { name: "Production Planned", value: "Production Planned" },
      { name: "Completed", value: "Completed" },
      { name: "Invoiced", value: "Invoiced" }
    ];

    // Determine the current stage index
    let currentIndex = -1;
    switch (currentProgress) {
      case "Pending":
        currentIndex = 0;
        break;
      case "Raw Meterial Allocation":
        currentIndex = 1;
        break;
      case "Procurement Sourcing":
        currentIndex = 2;
        break;
      case "Production Planned":
        currentIndex = 3;
        break;
      case "Completed":
        currentIndex = 4;
        break;
      case "Invoiced":
        currentIndex = 5;
        break;
      default:
        currentIndex = -1;
    }

    const handleDragStart = (e, stageIndex) => {
      e.dataTransfer.setData('text/plain', stageIndex.toString());
      setIsDragging(true);
    };

    const handleDragOver = (e, stageIndex) => {
      e.preventDefault();
      setDraggedOver(stageIndex);
    };

    const handleDragLeave = () => {
      setDraggedOver(null);
    };

    const handleDrop = async (e, targetStageIndex) => {
      e.preventDefault();
      const draggedStageIndex = parseInt(e.dataTransfer.getData('text/plain'));
      
      setDraggedOver(null);
      setIsDragging(false);

      // Only allow moving forward or to the same stage
      if (targetStageIndex >= currentIndex && targetStageIndex !== draggedStageIndex) {
        const targetStage = stages[targetStageIndex];
        await handleProgressChange(targetStage.value, workOrder.id);
      }
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      setDraggedOver(null);
    };

    return stages.map((stage, index) => {
      // Determine the state of this stage
      let statusColor = "bg-gray-300"; // default: not started
      let bgColor = "bg-gray-50";
      let borderColor = "";
      let statusText = "Pending";
      let isInteractive = false;

      if (index < currentIndex) {
        // Completed stage
        statusColor = "bg-green-500";
        statusText = `Completed${stage.date ? ` on ${stage.date}` : ''}`;
      } else if (index === currentIndex) {
        // Current stage
        statusColor = "bg-blue-500";
        bgColor = "bg-blue-50";
        borderColor = "border border-blue-100";
        statusText = "In progress";
        isInteractive = true;
      } else if (index > currentIndex) {
        // Future stages - can be dropped on
        isInteractive = true;
        statusText = "Upcoming";
      }

      // Drag over styling
      const isDraggedOver = draggedOver === index;
      if (isDraggedOver && index >= currentIndex) {
        bgColor = "bg-blue-100";
        borderColor = "border-2 border-blue-300 border-dashed";
      }

      return (
        <li 
          key={stage.name} 
          className="relative pl-8"
          onDragOver={(e) => isInteractive ? handleDragOver(e, index) : null}
          onDragLeave={handleDragLeave}
          onDrop={(e) => isInteractive ? handleDrop(e, index) : null}
        >
          <div className="absolute left-0 flex items-center justify-center w-8 h-8">
            <div 
              className={`w-3 h-3 ${statusColor} rounded-full border-4 border-white transition-all duration-200 ${
                index === currentIndex && isInteractive ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
              draggable={index === currentIndex}
              onDragStart={(e) => index === currentIndex ? handleDragStart(e, index) : null}
              onDragEnd={handleDragEnd}
            ></div>
          </div>
          <div 
            className={`p-2 rounded-md transition-all duration-200 ${bgColor} ${borderColor} ${
              isInteractive && index > currentIndex ? 'hover:bg-blue-50 cursor-pointer' : ''
            } ${isDraggedOver ? 'transform scale-105' : ''}`}
            onClick={() => {
              // Optional: Allow clicking to advance stages
              if (index > currentIndex && index <= currentIndex + 1) {
                handleProgressChange(stage.value, workOrder.id);
              }
            }}
          >
            <p className="text-xs font-medium">{stage.name}</p>
            <p className="text-xs text-gray-500 mt-1">{statusText}</p>
            {isInteractive && index > currentIndex && (
              <p className="text-xs text-blue-500 mt-1">Drop here to update</p>
            )}
          </div>
        </li>
      );
    });
  };

  return (
    <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">
          Production Stages
          {isDragging && (
            <span className="ml-2 text-xs text-blue-500">(Drag to update status)</span>
          )}
        </h3>
      </div>
      <div className="p-4">
        <div className="relative">
          <div className="absolute left-4 h-full w-0.5 bg-gray-200"></div>
          <ul className="space-y-4">
            {renderProductionStages(workOrder.progress)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductionStagesTimeline;