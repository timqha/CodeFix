process.env.NODE_ENV = 'test';
var Post = require("../app/models/post");

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server_rest.js');
var should = chai.should();
chai.use(chaiHttp);

describe('Posts', function() {
    Post.collection.drop();

    beforeEach(function(done){
        var nevPost = new Post({
            'title': 'Post for mocha test.',
            'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis delectus eum excepturi illo ipsam iure nam nisi non officia officiis qui, quo recusandae reiciendis rem repellendus ullam vel velit veniam?',
            'description': 'Здесь должно быть описание тестирование, этого ада.',
            'author': 'я',
            'image': 'boy.jpg'
        });
        nevPost.save(function(err) {
            done();
        });
    });
    afterEach(function(done){
        Post.collection.drop();
        done();
    });

    it('should list ALL posts on /posts GET', function(done) {
        chai.request(server)
            .get('/api/posts')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('text');
                res.body[0].should.have.property('description');
                res.body[0].should.have.property('author');
                res.body[0].should.have.property('image');
                res.body[0].title.should.equal('Post for mocha test.');
                res.body[0].text.should.equal('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis delectus eum excepturi illo ipsam iure nam nisi non officia officiis qui, quo recusandae reiciendis rem repellendus ullam vel velit veniam?');
                res.body[0].description.should.equal('Здесь должно быть описание тестирование, этого ада.');
                res.body[0].author.should.equal('я');
                res.body[0].image.should.equal('boy.jpg');
                done();
            });
    });

    it('should add a SINGLE post on /posts POST', function(done) {
        chai.request(server)
            .post('/api/posts')
            .send({
                'title': 'Post for mocha test',
                'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis delectus eum excepturi illo ipsam iure nam nisi non officia officiis qui, quo recusandae reiciendis rem repellendus ullam vel velit veniam?',
                'description': 'Здесь должно быть описание тестирование, этого ада.',
                'author': 'я',
                'image': 'boy.jpg'
            })
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('text');
                res.body.should.have.property('description');
                res.body.should.have.property('author');
                res.body.should.have.property('image');
                res.body.should.have.property('rate');
                res.body.should.have.property('show');
                res.body.should.have.property('created_at');
                res.body.should.have.property('_id');
                res.body.title.should.equal('Post for mocha test');
                res.body.text.should.equal('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis delectus eum excepturi illo ipsam iure nam nisi non officia officiis qui, quo recusandae reiciendis rem repellendus ullam vel velit veniam?');
                res.body.description.should.equal('Здесь должно быть описание тестирование, этого ада.');
                res.body.author.should.equal('я');
                res.body.image.should.equal('boy.jpg');
                done();
            });
    });

    it('should list a SINGLE post on /post/<id> GET', function(done) {
        var newPost = new Post({
            'title': 'Post for mocha test',
            'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis delectus eum excepturi illo ipsam iure nam nisi non officia officiis qui, quo recusandae reiciendis rem repellendus ullam vel velit veniam?',
            'description': 'Здесь должно быть описание тестирование, этого ада.',
            'author': 'я',
            'image': 'girl.jpg'
        });
        newPost.save(function(err, data) {
            chai.request(server)
                .get('/api/post/'+data.id)
                .end(function(err, res){
                    console.log(res.body, res.text);
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('title');
                    res.body[0].should.have.property('text');
                    res.body[0].should.have.property('description');
                    res.body[0].should.have.property('author');
                    res.body[0].should.have.property('image');
                    res.body[0].should.have.property('rate');
                    res.body[0].should.have.property('show');
                    res.body[0].should.have.property('created_at');
                    res.body[0].should.have.property('_id');
                    res.body[0].title.should.equal('Post for mocha test');
                    res.body[0].text.should.equal('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis delectus eum excepturi illo ipsam iure nam nisi non officia officiis qui, quo recusandae reiciendis rem repellendus ullam vel velit veniam?');
                    res.body[0].description.should.equal('Здесь должно быть описание тестирование, этого ада.');
                    res.body[0].author.should.equal('я');
                    res.body[0].image.should.equal('girl.jpg');
                    res.body[0]._id.should.equal(data.id);
                    done();
                });
        });
    });

    it('should update a SINGLE post on /post/<id> PUT', function(done) {
        chai.request(server)
            .get('/api/posts')
            .end(function(err, res){
                chai.request(server)
                    .put('/api/post/'+res.body[0]._id)
                    .send({'title': 'Spider'})
                    .end(function(error, response){
                        response.should.have.status(204);
                        done();
                    });
            });
    });

    it('should delete a SINGLE post on /post/<id> DELETE', function(done) {
        chai.request(server)
            .get('/api/posts')
            .end(function(err, res){
                chai.request(server)
                    .delete('/api/post/'+res.body[0]._id)
                    .end(function(error, response){
                        response.should.have.status(200);
                        response.body.should.have.property('success');
                        response.body.success.should.equal(true);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Post deleted!');
                        done();
                    });
            });
    });
});