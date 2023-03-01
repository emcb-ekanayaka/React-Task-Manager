import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import {v4 as uuid4 } from 'uuid';

function TaskForm() {

  const [message , setMessage] = useState('');

  const initialValues = {
    title : '',
    description: '',
    dueDate : '',
  }

  const onSubmit = (values , {resetForm}) => {

    const taskid = uuid4();
    const apiURL = `https://taskmanager-1e0c0-default-rtdb.asia-southeast1.firebasedatabase.app/tasks/${taskid}.json`;
    const tasks  = {
      ...values ,
      status: 'New',
      createdDate: new Date(),
      id:taskid
    }

    axios.put(apiURL , tasks)
    .then((response) => {
        if(response.status === 200){
          setMessage("Your Form has been Saved");
          resetForm({values:''})
        }
    })
    .catch((error) => {
      setMessage("Error... Data Not Saved");
    });
  }

  const validate = (values) => {
    let errors = {}
    if(!values.title){
      errors.title = "Title can't be empty"
    }
    if(!values.description){
      errors.description = "Description can't be empty"
    }
    if(!values.dueDate){
      errors.dueDate = "Duedate can't be empty"
    }
    return errors;
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,   
  });

  return (
    <div className="container col-sm-8 mt-4">
      <h4 className="mb-4">New Task</h4>
      <form onSubmit={formik.handleSubmit} method="post">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
          type="text"
          className="form-control"
          id="title"
          name="title" 
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value = {formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? (
          <div className='small text-danger'>{ formik.errors.title}</div>
          ):null }
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            rows="4"
            type="text"
            className="form-control"
            id="description"
            name="description"

          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value = {formik.values.description}
          />
          {formik.touched.description && formik.errors.description ? (
          <div className='small text-danger'>{ formik.errors.description}</div>
          ):null }
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="text"
            className="form-control"
            id="dueDate"
            name="dueDate"

          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value = {formik.values.dueDate}
          />
          {formik.touched.dueDate && formik.errors.dueDate ? (
          <div className='small text-danger'>{ formik.errors.dueDate}</div>
          ):null }
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>

        {message ? (<div className='alert alert-primary mt-4'>{  }</div>):null}
      </form>
    </div>
  );
}

export default TaskForm;
