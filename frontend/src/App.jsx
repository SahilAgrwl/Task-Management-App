import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useEffect } from 'react'
import axios from 'axios'

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'TODO' });

  // Fetch all tasks from the backend API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', formData);
      setFormData({ title: '', description: '', status: 'TODO' });
      fetchTasks();
    } catch (error) {
      console.error('Failed to add a new task:', error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { status });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleTaskDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div>
      <h1>Task Management Application</h1>

      {/* Task Form */}
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleInputChange} required />
        <label>Status:</label>
        <select name="status" value={formData.status} onChange={handleInputChange}>
          <option value="TODO">To-Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <button onClick={() => handleStatusUpdate(task._id, 'TODO')}>Set To-Do</button>
            <button onClick={() => handleStatusUpdate(task._id, 'IN_PROGRESS')}>Set In Progress</button>
            <button onClick={() => handleStatusUpdate(task._id, 'DONE')}>Set Done</button>
            <button onClick={() => handleTaskDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
