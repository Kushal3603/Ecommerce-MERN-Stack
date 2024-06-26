const mongoose = require('mongoose');
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:String,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisliked:{
        type:Boolean,
        default:false
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    image:{
        type:String,
        default:"https://www.shutterstock.com/image-photo/bloggingblog-concepts-ideas-white-worktable-1029506242"
    },
    author:{
        type:String,
        default:"Admin"
    },
},
    {
        toJSON:{
            virtuals:true
        },
        toObject:{
            virtuals:true
        },
        timestamps:true

    }
);

module.exports = mongoose.model('Blog', blogSchema);