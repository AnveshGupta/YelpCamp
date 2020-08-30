db =  require("mongoose");

campground = new db.Schema({
    name: String,
    src:String,
    des:String,
    comment:[
        {
            type: db.Schema.Types.ObjectId,
            ref: "comments"
        }
    ]
});
module.exports = db.model("campground",campground);