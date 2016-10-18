var client = require('supertest')(require('../app'));
var expect = require('chai').expect;
var db = require('../db');
var Trainer = db.models.Trainer;
var TrainerRegion = db.models.TrainerRegion;
var Region = db.models.Region;
var Promise = require('bluebird');

describe('routes', function(){
  before(function(done){
    db.sync()
      .then(function(){
        done();
      })
      .catch(done);
  });
  beforeEach(function(done){
    db.truncate()
      .then(function(){
        done();
      })
      .catch(done);
  });

  describe('POST /TrainerRegions', function(){
    it('redirects back to backTo', function(done){
      Promise.all([
          Trainer.create({ name: 'Oak' }),
          Region.create({ loc: 'kanto' }),
      ])
      .spread(function(Trainer, Region){
        client.post('/TrainerRegions/' + Trainer.id + '/' + Region.id + '?backTo=/foos')
          .expect(302)
          .end(function(err, result){
            if(err)
              return done(err);
            expect(result.header.location).to.equal('/foos');
            done();
          });
      })
    });
  });

  describe('POST /trainers', function(){
    it('redirects back to trainers', function(done){
      client.post('/trainers')
        .send('name=oak')
        .expect(302)
        .end(function(err, result){
          if(err)
            return done(err);
          expect(result.header.location).to.equal('/trainers');
          done();
        });
    });
  });

  describe('POST /regions', function(){
    it('redirects back to regions', function(done){
      client.post('/regions')
        .send('loc=jhoto')
        .expect(302)
        .end(function(err, result){
          if(err)
            return done(err);
          expect(result.header.location).to.equal('/regions');
          done();
        });
    });
  });
});
