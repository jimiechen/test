/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
  
  
 /**
 * Series Schema
 */
var SeriesSchema = new Schema({
  id: {type : String, default : '', trim : true,unique: true}//名称
  ,text:{type : String, default : '', trim : true} //备注
  ,pid:{type : String,ref:'Series',default : '-1'}
  //,parent:{type : String, default : '', trim : true}
  //,child:[{series:{type : Schema.ObjectId, ref : 'Series'}}]
},{ _id: false, autoIndex: false })

SeriesSchema.path('id').index({ unique: true });
/**
 * Methods
 */

SeriesSchema.methods = {
 saveObj:function(series){
 	
 	var _self = this;
 	Series.findOne({ id: series.id },function(err,seriesBean){
 		if (err) return console(err);
 		console.log('findOne\t'+JSON.stringify(seriesBean));
 		if(seriesBean){
 			if(seriesBean.text === series.text&&seriesBean.pid === series.pid){
 				console.log('no update');
 				return;
 			}
 			Series.update({id:seriesBean.id},{id:series.id,text:series.text,pid:series.pid},{strict :true},function(err,numberAffected, rawResponse){
 				if (err) return console.log(err);
 				console.log('update numberAffected '+numberAffected);
 			});
 		}else{
 			_self.save(function(err){
 			if (err) return console.log(err);
 			console.log('save');});
 		}
 	})
 	
 	/*Series.findOneAndUpdate({id:/^series.id/},series,function(err){
 		if(err) console.log("findOneAndUpdate err");
 		console.log('save success')
 	});*/
 	
 	/*
 	this.save(function(err){
 		if(err) console.log("err");
 		console.log('save success');
 	})*/
 }
 ,removeSeries:function(_node){
 	var cb = function(err){
 		if (err) return console.log(err);
 		console.log('remove {id:'+_node.id+'} success');
 	}
 	Series.remove({id:_node.id},cb);
 	Series.remove({pid:_node.id},cb);
 }
}
/**
 * Statics
 */

SeriesSchema.statics = {

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (cb) {
    this.find()
      .exec(cb)
  }

}
var Series = mongoose.model('Series', SeriesSchema)