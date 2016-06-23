var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
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
    var matchedTodo = _.findWhere(todos, {id:todoId});
    // todos.forEach(function(todo){
    //     if(todoId === todo.id){
    //         matchedTodo = todo;
    //     }
    // });
    
   if(matchedTodo) {
       res.json(matchedTodo);
   } else {
       res.status(404).send();
   }
});

// POST /todos
app.post('/todos', function(req, res){
    //use underscore to only use set field properties and not pass any others also to filter out unwanted additions of properties
    //var body = req.body;
   var body = _.pick(req.body, 'description', 'completed');
    
    //validate input if any of the fields 'completed', 'description', are empty then return a 404 not found error status
    //check if completed exists as a boolean or description exists as a string and is not an empty string.
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(404).send();
    }
     
    //remove any unwanted spaces from start and end of description field
    body.description = body.description.trim();
    
    body.id = todoNextId++;
    
    todos.push(body);
    res.json(body);
    console.log(body);
});


app.listen(PORT, function(){
  console.log('Express listening on port' + PORT + '!');  
});