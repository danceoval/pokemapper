var router = require('express').Router();
var models = require('../db').models;
var TrainerRegion = models.TrainerRegion;

module.exports = router;

router.delete('/:trainerId/:regionId', function(req, res, next){
  TrainerRegion.destroy({ where: {
        trainerId: req.params.trainerId,
        regionId: req.params.regionId
      }
  })
  .then(function(){
    res.redirect(req.query.backTo);
  })
  .catch(next);
});

router.post('/:trainerId/:regionId', function(req, res, next){
  TrainerRegion.create({
    trainerId: req.params.trainerId,
    regionId: req.params.regionId
  })
  .then(function(){
    res.redirect(req.query.backTo);
  })
  .catch(next);
});
