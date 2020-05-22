"use strict"
const express = require('express');
const app = express();
const air = require("./models/air.js");
const generator = require("./data/generators/AirGenerator.js");
const validator = require("./data/validator.js");
const mongoose = require('mongoose');
const config = require('./config');


const connectOptions = { useNewUrlParser: true };
mongoose.connect(config.DatabaseUrl, connectOptions)
	.then(() => console.log("MongoDB connected"))
	.catch(() => console.log("ERROR: MongoDB not connected"));

app.get("/", (req,res) => {    
    const airs = validator.ValidateAirConstituents(generator.GenerateAirArray());
    air.create(airs).then(() => {
        console.log(`Added ${airs.length} items`);
        res.end();
    });
    
});

app.get("/air", (req,res) => {
    air.getAll()
        .then(airs => {
            airs.forEach(air => {                
                res.write(`Temperature: ${air.temperature}\tHumidity: ${air.humidity}\tNi: ${air.ni}\n`);                
            });
            res.end();
        })
        .catch(() => {
            res.status(404).write("Not found");
            res.end();
        });
                    
});

app.listen(config.ServerPort, () => console.log(`listening on port ${config.ServerPort}`));