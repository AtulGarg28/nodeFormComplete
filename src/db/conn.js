const mongoose = require("mongoose");

mongoose.connect(process.env.DB ,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection successful");
}).catch((e)=>{
    console.log(`Some error in connection:- ${e}`);
});

