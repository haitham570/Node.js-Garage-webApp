const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AutoIncrement = require("mongoose-sequence")(mongoose);


const UserSchema = new mongoose.Schema ({
    _id: {type: Number},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    password:{type: String, required: true},
    userType: {type: String, required: true},
    securityQuestion: {type: String, required: true},
    securityAnswer: {type: String, required:true},
    feedback: {type:String, default:""},
    date: {type: Date, default: Date.now}
}, {_id: false });

UserSchema.plugin(AutoIncrement, "_id");

UserSchema.pre("save", async function(next){

    if (!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("User", UserSchema);