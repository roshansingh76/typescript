var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    category_name: { type: String,  required: [true, 'Category name must be provided'] },
    slug: { type: String  ,unique: true},
    parentId: {type:String, ref: 'categories',index: true,  default: undefined}
   
});

module.exports = mongoose.model('Categories', userSchema);