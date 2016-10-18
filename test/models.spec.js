var expect = require('chai').expect;
var db = require('../db');
var models = db.models;
var Trainer = models.Trainer;
var TrainerRegion = models.TrainerRegion;
var Region = models.Region;
var Promise = require('bluebird');

describe('Models', function(){
  before(function(done){
    db.sync()
      .then(function(){
        done();
      })
      .catch(done);
  });

  
  describe('Region', function(){
    it('it exists', function(){
      expect(Region).to.be.ok;
    });
    
    describe('#hasTrainer', function(){
      var oak, kanto, jhoto;
      beforeEach(function(done){
        Promise.all([
          Trainer.create({ name : 'oak'}),
          Region.create({ loc: 'Kanto' }),
          Region.create({ loc: 'Jhoto' })
        ])
        .spread(function(_profOak, _kanto, _jhoto){
          oak = _profOak;
          kanto = _kanto;
          jhoto = _jhoto;

          return TrainerRegion.create({
            regionId: kanto.id,
            trainerId: oak.id
          });
        })
        .then(function(){
          return Promise.all([
            Region.findById(kanto.id, { include: [ TrainerRegion ]}),
            Region.findById(jhoto.id, { include: [ TrainerRegion ]}),
          ])
        })
        .spread(function(_kanto, _jhoto){
          kanto = _kanto;
          jhoto = _jhoto;
          done();
        })
        .catch(done);
      
      });
      it('kanto has oak', function(){
        expect(kanto.hasTrainer(oak.id)).to.equal(true);
      });

      it('jhoto does not have oak', function(){
        expect(jhoto.hasTrainer(oak.id)).to.equal(false);
      });
    });

    describe('creation', function(){
      var unova;
      beforeEach(function(done){
        Region.create({ loc: 'unova' })
          .then(function(_unova){
            unova = _unova;
            done();
          })
          .catch(done);
      });
      it('can be created', function(){
        expect(unova.loc).to.equal('unova');
      });
    });
  });

  describe('Trainer', function(){
    it('it exists', function(){
      expect(Trainer).to.be.ok;
    });

    describe('#hasRegion', function(){
      var oak, kanto, jhoto;
      beforeEach(function(done){
        Promise.all([
          Trainer.create({ name: 'oak'}),
          Region.create({ loc: 'kanto' }),
          Region.create({ loc: 'jhoto' })
        ])
        .spread(function(_oak, _kanto, _jhoto){
          oak = _oak;
          kanto = _kanto;
          jhoto = _jhoto;

          return TrainerRegion.create({
            regionId: kanto.id,
            trainerId: oak.id
          });
        })
        .then(function(){
          return Trainer.findById(oak.id, { include: [ TrainerRegion ]});
        })
        .then(function(_oak){
          oak = _oak;
          done();
        })
        .catch(done);
      
      });
      it('oak has region with loc of kanto', function(){
        expect(oak.hasRegion(kanto.id)).to.equal(true);
      });

      it('oak does not have region with loc of jhoto', function(){
        expect(oak.hasRegion(jhoto.id)).to.equal(false);
      });
    
    });

    describe('creation', function(){
      var oak;
      beforeEach(function(done){
        Trainer.create({ name: 'oak' })
          .then(function(_oak){
            oak = _oak;
            done();
          })
          .catch(done);
      });
      it('can be created', function(){
        expect(oak.name).to.equal('oak');
      });
    });
  });
});
