const mongoose = require('mongoose');

//Enviroment variables acces

//Connect DB
// Mongo Path -> mongod --dbpath=/home/mike/data

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("DB connected");
}); 
