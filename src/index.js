const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRoute = require('./routers/user')
const taskRoute = require('./routers/task')

const app = express();

const port = process.env.PORT

// app.use((req,res,next) => {

//   res.status(503).send("Site is currently down. Check back soon!")

// })



app.use(express.json());
app.use(userRoute);
app.use(taskRoute);




app.listen(port, () => {
  console.log('Server is running at port ' + port);
});
