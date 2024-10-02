import React from 'react';
import ProjectFilter from './ProjectFilter';
import Stages from './Stages';

function KanbanBoard() {
  return (
    <div>
      <ProjectFilter />
      <Stages />
    </div>
  );
}

export default KanbanBoard;
