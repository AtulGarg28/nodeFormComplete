const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

registerUserSchema.methods.generateAuthToken = async function () {
    try {
        // Here first we are passing the unique identifier.
        const ourToken = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        console.log(ourToken);
        this.tokens = this.tokens.concat({token:ourToken});
        await this.save();
        return ourToken;
    } catch (error) {
        res.send("The error part" + error);
        console.log("The error part" + error);
    }
}

registerUserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword =  await bcrypt.hash(this.password, 10);
    }
    next();
})

const RegisterModel = new mongoose.model("Register", registerUserSchema);

module.exports = RegisterModel;