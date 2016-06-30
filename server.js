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

//  GET /todos -get all plus if add query string get all completed true or false
app.get('/todos', function(req, res){
    var queryParams = req.query;
    var filteredTodos = todos;
    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true' ) {
        filteredTodos = _.where(filteredTodos, {completed:true});
    } else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false' ) {
        filteredTodos = _.where(filteredTodos, {completed:false});
    } 
         
    res.json(filteredTodos);
    
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

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id:todoId});
    if(matchedTodo){
        todos = _.without(todos, matchedTodo);
        return res.json(matchedTodo);
    } else {
        return res.status(404).json({"error":"Not deleted as no item found to delete"});
    }
}); 

// PUT /todos/:id  -- equates to update in the crud
app.put('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);  //get the id of the item to update from the given object
    var matchedTodo = _.findWhere(todos, {id:todoId}); //place that object in temporary variable
    //get the object item sent to be updated on the required fields
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    
    //if no item sent over for update then exit before running any more code
    if(!matchedTodo) {
        return res.status(404).send();  //404 - not found
    }
    
    //verify completed field
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')){
        return res.status(400).send();  //400 - bad request
    } else {
        
    }
    
    //verify description field
    if( body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttributes.description = body.description.trim();
    } else if (body.hasOwnProperty('description')){
        return res.status(400).send(); //400 - bad request
    } else {
        
    }
    
    //if got to here then can do the update
    //due to javasecipt passing objects by ref and not by value (would not work for primitives non objects)
    //the update is covered by this line where the original is updated with the new and returned all automatically
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo); //response json automatically sends back a success status 200 
    
});

app.listen(PORT, function(){
  console.log('Express listening on port' + PORT + '!');  
});