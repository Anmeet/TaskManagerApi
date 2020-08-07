const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');


router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    const tasks = await task.save();
    res.status(201).send(tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});
//Get /tasks?completed=true
//Get /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if(req.query.sortBy){
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] =  parts[1] ==='desc' ? -1 : 1
  }
  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        },
      })
      .execPopulate();
    res.status(201).send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    //const task = await Task.findById({ _id });
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const upTask = Object.keys(req.body);
  const allowedUpdatedtask = ['completed', 'description'];
  const isValidatedTask = upTask.every(element =>
    allowedUpdatedtask.includes(element)
  );

  if (!isValidatedTask) {
    return res.status(404).send({ error: 'Invalid task!!' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body,{new: true, runValidators: true})
    if (!task) {
      return res.status(404).send({ error: 'task not found' });
    }
    upTask.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({ error: 'no task' });
    }
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});




module.exports = router;
