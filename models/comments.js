db =  require("mongoose");

comment = new db.Schema({
    author: String,
    text:String,
});
module.exports = db.model("comments",comment);