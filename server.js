var express = require('express');
var app = express();
var PORT = process.env.PORT || 3090;    //port variable for heroku or the local one of 3090 whichever is available
var todos = [
    {id:1,
     description: 'Meet mom for lunch',
     completed: false },
    {id:2,
     description: 'Go to market',
     complete: false },
    {id:3,
     description: 'Do nodejs tutorial',
     completed: true }
];

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


app.listen(PORT, function(){
  console.log('Express listening on port' + PORT + '!');  
});