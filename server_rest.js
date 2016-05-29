// CALL THE PACKAGE ============================================
var express = require("express"),app = express();
var bodyParser = require("body-parser");
var morgan = require("morgan"); // used to see request
var mongoose = require("mongoose");
var port = process.env.PORT || 8081; // set the port for our app
var ObjectId = require('mongodb').ObjectID;

// APP CONFIG ===================================================

// *** config file *** //
var config = require('./config');

// *** mongoose *** ///
mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
    if(err) {
        console.log('Error connecting to the database. ' + err);
    } else {
        console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
    }
});

var User = require('./app/models/user');
var Post = require('./app/models/post');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// configure our app to handle CORS request
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \
    Authorization');
    next();
});

// log all request to the console
app.use(morgan('dev'));

// Routs for API ================================================

//app.get('*', function(req, res) {
//    res.sendFile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
//});

// get an instance of the express router
var apiRouter = express.Router();

// middleware fot use for all request
apiRouter.use(function(req, res, next){
    // do logging
    console.log('Somebody just came to our app!');
    // we'll add more to the middleware in next
    // this is where we will authenticate user
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

apiRouter.route('/users')
    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
// create a new instance of the User models
        var user = new User();
// set the users information (comes from the request)
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
// save the user and check for errors
        user.save(function(err) {
            if (err) {
// duplicate entry
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that\
username already exists. '});
                else
                    return res.send(err);
            }
            res.json({ message: 'User created!' });
        });
    })
    .get(function(req, res){
        User.find(function(err, users){
            if(err) res.send(err);
            res.json(users);
        });
    });

//noinspection JSUnresolvedFunction
apiRouter.route('/posts')
    .post(function(req, res){
        var post = new Post();
        post.title = req.body.title;
        post.description = req.body.description;
        post.text = req.body.text;
        //post.rate = req.body.rate;
        post.author = req.body.author;
        post.image = req.body.image;
        //post.show = req.body.show;

        console.log(post);
// save the user and check for errors
        post.save(function(err, data) {
            if (err) {
                return res.json({ success: false, message: 'A post with that title already exists. '});
            } else {
                return res.send(data);
            }
        })
    })
    .get(function(req, res){
        Post.find(function(err, posts){
            if(err) return res.send(err);
            return res.json(posts);
        });
    });

apiRouter.delete('/post/:post_id', function(req, res) {
    console.log(req.params.post_id);
    Post.remove({_id: req.params.post_id}, function (err, data) {
        if (!err) {
            return res.send({success: true,message:'Post deleted!'});
        } else {
            return res.send({success: false, message:'Error deleting post!'});
        }
    });
});

apiRouter.put("/post/:id", function(req, res) {
    var updatePost = req.body;
    delete updatePost._id;

    Post.update({_id: new ObjectId(req.params.id)}, updatePost, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update posts");
        } else {
            res.status(204).end();
        }
    });
});

apiRouter.get('/post/:post_id', function(req, res) {
    Post.find({_id: ObjectId(req.params.post_id)}, function (err, data) {
        if (!err) {
            if(data) return res.send(data);
            else return res.send({success: true, message:"Error don't find post!"});
        } else {
            return res.send({success: false, message:"Error post/:id post!"});
        }
    });
});
// more routes for our API will happen here

// REGISTER OUR ROUTES ===========================================
// all of our routes will be prefixed with /api

app.use('/api', apiRouter);

// START THE SERVER
app.listen(port);
console.log('Server start on port '+port);
module.exports = app;

// https://habrahabr.ru/post/241788/
//node node_modules/.bin/mocha
//http://mherman.org/blog/2015/09/10/testing-node-js-with-mocha-and-chai/#.Vy0U9lZ97Zs