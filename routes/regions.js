var router = require('express').Router();
var Promise = require('bluebird');
var models = require('../db').models;
var Region = models.Region;
var Trainer = models.Trainer;
var TrainerRegion = models.TrainerRegion;

module.exports = router;

router.get('/', function(req, res, next){
  //what do we need here??
  //regions.. with the salesPeople
  //plus all salesPeople
  Promise.all([
      Region.findAll({ include: [ TrainerRegion ] }),
      Trainer.findAll()
  ])
  .spread(function(regions, trainers){
    res.render('regions', {
      regions: regions,
      trainers: trainers,
      mode: 'regions'
    });
  
  });
});

router.post('/', function(req, res, next){
  Region.create({
    loc: req.body.loc
  })
  .then(function(region){
    res.redirect('/regions');
  })
  .catch(next);
});
