var Sequelize = require('sequelize');
var dbname = 'postgres://localhost/trainer_regions';
var db = new Sequelize(dbname, {
  logging: false
});

var Trainer = db.define('trainer', {
  name: Sequelize.STRING
}, {
  instanceMethods: {
    hasRegion: function(regionId){
      return this.trainer_regions.filter(function(TrainerRegion){
        return TrainerRegion.regionId === regionId;
      }).length > 0;

    }
  }
});

var Region = db.define('region', {
  loc: Sequelize.STRING
}, {
  instanceMethods: {
    hasTrainer: function(TrainerId){
      return this.trainer_regions.filter(function(TrainerRegion){
        return TrainerRegion.trainerId === TrainerId;
      }).length > 0;
    }
  }

});

var TrainerRegion = db.define('trainer_region', {});

TrainerRegion.belongsTo(Region);
TrainerRegion.belongsTo(Trainer);

Trainer.hasMany(TrainerRegion);
Region.hasMany(TrainerRegion);

module.exports = {
  models: {
    Trainer: Trainer,
    Region: Region,
    TrainerRegion: TrainerRegion
  },
  sync: function(){
    return db.sync({force: true });
  },
  truncate: function(){
    return TrainerRegion.destroy({ where: {} })
      .then(function(){
        return Promise.all([
            Trainer.destroy( { where: {} }),
            Region.destroy( { where: {} })
        ]);
      })
  }
};
