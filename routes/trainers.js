var router = require('express').Router();
var models = require('../db').models;
var Promise = require('bluebird');
var Trainer = models.Trainer;
var Region = models.Region;
var TrainerRegion = models.TrainerRegion;

module.exports = router;

router.get('/', function(req, res, next){
  Promise.all([
      Trainer.findAll({ include: [ TrainerRegion ] }),
      Region.findAll()
  ])
  .spread(function(trainers, regions){
    res.render('trainers', {
      mode: 'salesPeople',
      trainers: trainers,
      regions: regions
    });
  })
  .catch(next);
});

router.post('/', function(req, res, next){
  Trainer.create({
    name: req.body.name
  })
  .then(function(Trainer){
    res.redirect('/trainers');
  })
  .catch(next);
});
