var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors({
  origin: 'http://www.localhost:5000'
}));

app.use(function(req,res,next){
  console.log("Received a request with URL: "+req.protocol +"://"+req.get('host')+req.originalUrl);
  next();
})

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", 
   "Origin, X-Requested-With, Content-Type, Accept"); 
   next(); 
  });

app.get('/', (req, res) => {
  res.header("Access-Control-Allow-Origin: *");
  res.end("Hello World");
});

app.listen(8080, () => console.log('Backend API listening on port 8080!'))