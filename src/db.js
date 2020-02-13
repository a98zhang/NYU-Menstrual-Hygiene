const mongoose = require('mongoose');


const Location = new mongoose.Schema({
    name: String,
    code: String,
    lat: Number,
    lng: Number,
    type: String,
    campus: String,
    items: {
        type: Array,
        'default': [{ name: "tampons", shortage: false, free: true},
                    { name: "pads", shortage: false, free: true},]
    }
});
Location.index({name: 'text'});
mongoose.model('Location', Location);


const Report = new mongoose.Schema({
    campus: String,
    location: Location, //String
    message: String,
    item: String,
    time: {type: String, default: Date(Date.now()).toString()},
    id: {type: String, default: (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5)} 
                
});

mongoose.model('Report', Report);


const User = new mongoose.Schema({
    username: String,
    password: String,
    report: [Report],
    periods: Array,
    id: {type: String, default: (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5)}      
});

mongoose.model('User', User);



let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, '../config.json');
 console.log(fn);
 const data = fs.readFileSync(fn);
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 dbconf = 'mongodb://localhost/qz698';
}


mongoose.connect(dbconf, 
                { useNewUrlParser: true, useUnifiedTopology: true});

