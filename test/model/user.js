/**
 * Created by prosolvo on 07/05/16.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server_rest.js');
var should = chai.should();

chai.use(chaiHttp);

describe('Users', function() {
    it('should list ALL users on /users GET', function(done) {
        chai.request(server)
            .get('/api/users')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it('should add a SINGLE user on /users POST');
    it('should list a SINGLE user on /user/<id> GET');
    it('should update a SINGLE user on /user/<id> PUT');
    it('should delete a SINGLE user on /user/<id> DELETE');
});