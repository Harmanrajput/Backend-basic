let mongoose = require('mongoose')
let DB_URL = "mongodb://127.0.0.1:27017/demoProject"

mongoose.connect(DB_URL)
  .then(() => console.log('Database Connected!'));