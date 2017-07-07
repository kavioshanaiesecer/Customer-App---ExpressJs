var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);

var app = express();

/*
// Middleware
var logger = function(req, res, next){
	console.log('Logging.....');
	next();
}

app.use(logger);
*/

// View Engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));


// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname,'public')));

// Global Vars
app.use(function(req,res,next){
	res.locals.errors = null
	next();
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var users = [
	{
		id: 1,
		first_name: 'John',
		last_name: 'Doe',
		email: 'kaveendraOshan@gmail.com',
	},
	{
		id: 2,
		first_name: 'Oshan',
		last_name: 'Doe',
		email: 'sumanadasa@gmail.com',
	},
	{
		id: 3,
		first_name: 'Sirisena',
		last_name: 'Doe',
		email: 'galmangoda@gmail.com',
	},
	{
		id: 4,
		first_name: 'Mahinda',
		last_name: 'Doe',
		email: 'galpatha@gmail.com',
	}
]

// var person = [ 
// 	{
// 		name: 'Jeff',
// 		age: 30
// 	},
// 	{
// 		name: 'Sera',
// 		age: 20
// 	},
// 	{
// 		name: 'Wilson',
// 		age: 34	
// 	}
// ]

// Delete Routing
app.delete('/users/delete/:id',function(req,res){
	alert(1);
	console.log(req.params.id);
});

// Port Listening
app.listen(3000, function(){
	console.log("Server Starts on Port 3000..");
})

// Routing
app.get('/', function(req,res){
	// find everything
	db.users.find(function (err, docs) {
		res.render('index',{
			title: 'Hogwards Wizard School',
			users: docs
	});
	})
	
})

// Getting the post request from the form
app.post('/users/add', function(req, res){

	req.checkBody('first_name','First Name is Reqired').notEmpty();
	req.checkBody('last_name','Last Name is Reqired').notEmpty();
	req.checkBody('email','Email is Reqired').notEmpty();

	var errors = req.validationErrors();

	if(errors){
			res.render('index',{
			title: 'Hogwards Wizard School',
			users: users,
			errors: errors
	});

	}else{
		var newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}
		db.users.insert(newUser,function(err,result){
			if(err){
				console.log(err);
			}	
			else{
				res.redirect('/');
			}
		});
	}
});

// // Send Json
// app.get('/',function(req,res){
// 	res.json(person);
// })