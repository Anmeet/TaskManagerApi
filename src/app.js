const express = require('express');
require('./db/mongoose');

const userRoute = require('./routers/user')
const taskRoute = require('./routers/task')

const app = express();



// app.use((req,res,next) => {

//   res.status(503).send("Site is currently down. Check back soon!")

// })



app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

module.exports = app



