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

mongoose.model('Location', Location);


const Report = new mongoose.Schema({
    campus: String,
    location: Location,
    message: String,
    item: String,
    time: {type: Date, default: Date.now}
});

mongoose.model('Report', Report);

let dbconf;

if (process.env.NODE_ENV === 'PRODUCTION') {
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, '../config.json');
    console.log(fn);
    const data = fs.readFileSync(fn);
} else {
    dbconf = "mongodb://localhost/menstrualDB";
}

mongoose.connect(dbconf,
                { useNewUrlParser: true, useUnifiedTopology: true});
