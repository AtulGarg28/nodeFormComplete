const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/sign_In_Form",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection successful");
}).catch((e)=>{
    console.log(`Some error in connection:- ${e}`);
});

