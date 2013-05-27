
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
  
var FileSchema = new Schema({
  id: {type : String, default : '', trim : true,unique: true}//图片ID
  ,name:{type : String, default : '', trim : true} //图片名称
  ,pid:{type : String, ref:'Series', default : '-1'} //所属目录
  ,cdn:[{type : String, default : '', trim : true}]
})
  