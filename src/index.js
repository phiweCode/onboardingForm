const express = require('express');
const app = express()
const path = require('path')
const visitorRouters = require('./routes/visitor_routes')
const {
  createTable
} = require('../src/models/db_services');

app.use(express.static(path.join(__dirname, '../public')))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
app.use('/', visitorRouters)

app.use((err, _req, res, _next) => {
  err.statusCode ? res.status(err.statusCode).json({
    status: "error",
    message: err.message
  }) : res.status(500).json({
    status: "error",
    message: err.message
  })
})

app.listen(3000, async () => {
  await createTable()
    .then(console.log)
    .catch(err => {
      console.error('Table creation failed:', err);
      process.exit(1);
    })
  console.log("Server listening on port 3000. Visit http://localhost:3000/new_visitor")
})