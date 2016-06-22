var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3090;    //port variable for heroku or the local one of 3090 whichever is available
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('Todo API Root');  
});

//  GET /todos -get all
app.get('/todos', function(req, res){
    res.json(todos);
});

// GET /todos/:id  - get one 
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo;
    todos.forEach(function(todo){
        if(todoId === todo.id){
            matchedTodo = todo;
        }
    });
    
   if(matchedTodo) {
       res.json(matchedTodo);
   } else {
       res.status(404).send();
   }
});

// POST /todos
app.post('/todos', function(req, res){
    var body = req.body;
    body.id = todoNextId++;
    //todoNextId++;
    todos.push(body);
    res.json(body);
    console.log(body);
});


app.listen(PORT, function(){
  console.log('Express listening on port' + PORT + '!');  
});