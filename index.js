const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan')
const knex = require('knex');

const knexConfig = {
  client:'sqlite3',
  useNullAsDefault: true,
  connection:{
    filename:'./data/lambda.sqlite3'
  }

}

const db = knex(knexConfig);

const server = express();

server.use(helmet());
server.use(express.json());
server.use(morgan('dev'));
//promises

// endpoints here
// add an entry
server.post('/api/zoos',async (req, res) => {
  try {
    const [id] = await db('zoos').insert(req.body);
    const zoo = await db('zoos')
    .where({id})
    .first()
    res.status(201).json(zoo);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json(error);
  }
  
})

// list all 
server.get('/api/zoos', async (req, res)=>{
  try{
    console.log(res.body)
 const zoos = await db('zoos')
 console.log(zoos.name)
 res.status(200).json(zoos);
  }catch(error){
    res.status(500).json(error)
  }
});

server.get('/api/zoos/:id', async (req, res)=>{
  try{
 const zoos = await db('zoos').where({ id: req.params.id }).first();
 console.log(zoos)
 res.status(200).json(zoos)
  }catch(error){
    res.status(500).json(error)
  }
});

const port = process.env.PORT ||3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
