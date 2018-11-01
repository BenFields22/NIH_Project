var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser')

var posts = [];

app.use(cors({
  origin: 'http://www.localhost:5000'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

app.use(function(req,res,next){
  var myURL = req.protocol +"://"+req.get('host')+req.originalUrl;
  var PostObject = {
    'URL':myURL,
    'RequestBody':JSON.stringify(req.body),
    'Time': new Date().toLocaleString()
  };
  posts.push(PostObject);
  console.log("Received a request with URL: "+myURL);
  console.log("body is : "+JSON.stringify(req.body));
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
  var html = "<ul>";
  posts.forEach(function (arrayItem) {
    html = html + "<li>";
    html = html + "URL: "+arrayItem.URL + "<br/>RequestBody: "+ arrayItem.RequestBody + "<br/>Time: "+ arrayItem.Time;
    html = html + "</li><br>";
});
  html = html + "</ul>"
  res.send(html);
});

app.post('/test',(req,res)=>{
  res.header("Access-Control-Allow-Origin: *");
  res.send("Hello from test");
});

app.listen(8080, () => console.log('Backend API listening on port 8080!'))