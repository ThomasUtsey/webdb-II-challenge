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
//error handleing 
const errors = { 
  '19':'Another entree has the same value no duplicates'
}

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
    const message = errors[error.errno] || 'Retry different value server error';
    res.status(500).json({message, error});
  }
  
})

// list all 
server.get('/api/zoos', async (req, res)=>{
  try{
 const zoos = await db('zoos')
 res.status(200).json(zoos);
  }catch(error){
    res.status(500).json(error)
  }
});
// list entree by id
server.get('/api/zoos/:id', async (req, res)=>{
  try{
 const zoos = await db('zoos').where({ id: req.params.id }).first();
 res.status(200).json(zoos)
  }catch(error){
    res.status(500).json(error)
  }
});

// update an entree

server.put('/api/zoos/:id',async (req,res)=>{
  try{
 const result = await db('zoos')
 .where({ id: req.params.id })
 .update(req.body);

if(result > 0) {
  const zoo = await db('zoos')
    .where({ id: req.params.id })
    .first();
  res.status (200).json(zoo); 
}else{
  res.status(404).json({message: 'Records not found'})
}
  }catch(error){
    res.status(500).json(error)
  }
});

// remove an entree

server.delete('/api/zoos/:id',async (req,res)=>{
  try{
 const result = await db('zoos')
 .where({ id: req.params.id })
 .del();

if(result > 0) {
  res.status (200).end(zoo); 
}else{
  res.status(404).json({message: 'Records not found'})
}
  }catch(error){
    res.status(500).json(error)
  }
});



const port = process.env.PORT ||3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
