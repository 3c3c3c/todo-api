var express = require('express');
var app = express();
var PORT = process.env.PORT || 3090;    //port variable for heroku or the local one of 3090 whichever is available

app.get('/', function(req, res){
    res.send('Todo API Root');  
});

app.listen(PORT, function(){
  console.log('Express listening on port' + PORT + '!');  
});