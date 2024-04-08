import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
    likedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User id required"],
    }, 
    likedByName:{
        //  propogate name change here if, user change his name
        //  reducing joins
        type:String
    }

})

const commentSchema = new mongoose.Schema({
    commentedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User id required"],
    }, 
    text:{
        type:String, 
        required:[true, 'Text is required']
    }
})

const BlogSchema = new mongoose.Schema({
    createdByUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User id required"],
    },
    title: {
        // user name
        type: String,
        required:[true, 'Title is required']
    },
    description:{
        type:String, 
        required:[true, "Description is required"]
    }, 
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        // required: [true, "CategoryId is required"],
    },
    /* We can normalize comment and like embedded Schema , if required in future */
    totalLikes:{type:Number, default:0},
    totalComments:{type:Number, default:0},
    likes:[LikeSchema],  
    comments:[commentSchema],
    tags:[String], 
    images:[String],
    isApprovedByAdmin:{type:Boolean, default:false},
    feedBack:{type:String}

}, {timestamps:true});





export const Blog = mongoose.model("Blog", BlogSchema);
