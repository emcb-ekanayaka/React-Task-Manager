import React, { useEffect, useState } from 'react';

import TaskItem from './TaskItem';
import axios from 'axios';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskUpdate , setTaskUpdate] = useState(false);

  useEffect(() => {
    const apiURL = 'https://taskmanager-1e0c0-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json';
    axios.get(apiURL).then((response) =>{
    if(response.data){
      setTasks(Object.values(response.data));
    }
  });
  }, [taskUpdate]);

  const completedTask = (taskId) =>{
    const apiURL = `https://taskmanager-1e0c0-default-rtdb.asia-southeast1.firebasedatabase.app/tasks/${taskId}.json`;

    axios.patch(apiURL, {status: 'Completed'}).then((response) => {
        setTaskUpdate(!taskUpdate);
    });
  };

  // java Script ES6
  const displayTasks = () => {
    return tasks.map((task) => {
      return <TaskItem key={task.id} taskInfo={task} onComplete={completedTask}/>;
    });
  };

  return (
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-md-3">{displayTasks()}</div>
    </div>
  );
}

export default TodoList;
