import React, { useState, useEffect } from "react";
import { ITaskData } from "./types";

const App = () => {
  const [tasks, setTasks] = useState<ITaskData[]>([]);
  const [globalTasks, setGlobalTasks] = useState<ITaskData[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Fetch cards from the API
  useEffect(() => {
    fetch("/api/tasks")
      .then((response) => response.json())
      .then((data) => {setTasks(data); setGlobalTasks(data);})
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const deleteHandler = (index:number) =>{
    let newTasks = [...tasks];
    newTasks.splice(index,1);
    setTasks(newTasks)
  }

  
  const doneHandler = (index:number) =>{
    let newTasks = [...tasks];
    newTasks = newTasks.map((task,ti)=>{
      if(ti=== index){
        return {...task,status: 'completed'}
      }
      return task;
    });
    setTasks(newTasks)
  }



  const addHandler = () =>{
    let newTasks = [...tasks, {
        "id": tasks.length + 1,
        "category": category,
        "title": title,
        "status": "pending",
        "description": description
    }];
    setTasks(newTasks)
    setTitle('');
    setDescription('');
    setCategory('');
  }

  const onSearchChange = (query: string) =>{
    setSearch(query);
    if(query.trim().length > 0){
      let newTasks = [...globalTasks];
      newTasks = newTasks.filter((task)=>{
        const modifiedQuery = query.toLocaleLowerCase();
        const modifiedCategory = task.category.toLocaleLowerCase();
        return modifiedCategory.includes(modifiedQuery);
      });
      setTasks(newTasks);
      setSearch(query);
    }else{
      setTasks(globalTasks)
    }
  
  }

  return (
    <>
      <div>
      <label >Search</label>
        <input type='text' value={search} name="title" onChange={(e)=>{
          onSearchChange(e.target.value)
        }}/>
        {tasks.map((task,index)=>{
          return (
            <div className="task-card" key={task.id} style={{
              backgroundColor: task.status === 'completed'? 'green': 'white',
              margin: '1rem'
            }}>
              <div>{task.title}</div>
              <div>{task.description}</div>
              <div>{task.category}</div>
              <button onClick={()=>{deleteHandler(index)}}>Delete</button>
              <button onClick={()=>{doneHandler(index)}}>Done</button>
            </div>
          )
        })}
        <label >Title</label>
        <input type='text' value={title} name="title" onChange={(e)=>{
          setTitle(e.target.value);
        }}/>
        <label >Description</label>
         <input type='text' value={description} name="description" onChange={(e)=>{
          setDescription(e.target.value);
        }}/>
        <label>Category</label>
         <input type='text' value={category} name="category" onChange={(e)=>{
          setCategory(e.target.value);
        }}/>
        <button onClick={()=>{addHandler()}}>Add</button>
      </div>
    </>
  );
};

export default App;