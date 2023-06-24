const express = require("express");
const conectToMongo = require("./db/db_config");
const cors = require('cors')
conectToMongo();

const app = express();
const port = 5000
app.use(cors());
app.use(express.json());
//available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/note', require('./routes/note'));

if (process.env.NODE_ENV == 'production') {
  const path = require('path');
  app.get('/', (req, res) => {
    app.use(express.static(path.resolve(__dirname, 'client', 'build')));
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })

}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})








/* const connectdb = async ()=>{
    mongoose.connect("mongodb://localhost:27017/testdb");
    const testCollectionSchema=new mongoose.Schema({});
    const testCollectonModel=mongoose.model('testcollections',testCollectionSchema);
    const data=await testCollectonModel.find();
    console.warn(data);
}
connectdb(); */
