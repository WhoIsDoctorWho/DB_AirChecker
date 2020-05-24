"use strict"
const express = require('express');
const app = express();
const air = require("./models/air.js");
const generator = require("./data/generators/AirGenerator.js");
const validator = require("./data/validator.js");
const mongoose = require('mongoose');
const config = require('./config');
const consolidate = require('consolidate');
const path = require('path');

const d3 = require("d3");
const Correlation = require('node-correlation');
const Regression = require('regression');
const _ = require("lodash");

let dbOptions = { useNewUrlParser: true };
if(config.DatabaseUrl.indexOf('replicaSet') > - 1) {
    dbOptions = {
      db: {native_parser: true},
      replset: {
        auto_reconnect:false,
        poolSize: 10,
        socketOptions: {
          keepAlive: 1000,
          connectTimeoutMS: 30000
        }
      },
      server: {
        poolSize: 5,
        socketOptions: {
          keepAlive: 1000,
          connectTimeoutMS: 30000
        }
      }
    };
  };
mongoose.connect(config.DatabaseUrl, dbOptions)
	.then(() => console.log("MongoDB connected"))
	.catch(x => console.log("ERROR: MongoDB not connected" + x));

app.engine('html', consolidate.swig);

app.use("/diagrams", express.static(path.join(__dirname, 'diagrams')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get("/", async (req,res) => {   
    res.render('index');
});
app.get("/randomize", async (req,res) => {   
  await air.delete();    
  const airs = validator.Validate(generator.GenerateAirArray());
  await air.create(airs)
  console.log(`Added ${airs.length} items`);
  res.redirect('/air');
});

app.get("/air", async (req,res) => {
  const airs = await air.getAll();
  let index = 1;
  airs.forEach(air => {                
    res.write(`${index++}. Date: ${air.date.toLocaleDateString("en-US")}
    Temperature: ${air.temperature}\tHumidity: ${air.humidity}\tNi: ${air.ni}\tCO2: ${air.co2}\tO2: ${air.o2}\t
    pm10: ${air.pm10}\tpm2.5: ${air.pm2_5}\n`);                
  });
  res.end();                  
});
app.get("/complex", (req, res) => {
  res.render('complex');
});
app.get("/airaverage/data", (req, res) => {
  air.getAll()
    .then(airs => {
      let averageO2 = d3.mean(airs, d => d.o2);
      let averageCO2 = d3.mean(airs, d => d.co2);
      let averageNi = d3.mean(airs, d => d.ni);
      let data = [
        {
          'name': 'CO2',
          'amount': averageCO2 * 5
        },
        {
          'name': 'O2',
          'amount': averageO2 
        },
        {
          'name': 'N',
          'amount': averageNi 
        }];
      res.json(data);
    })
    .catch(() => {
      res.status(404).write("Not found");
      res.end();
    });
});
app.get("/airaverage", (req, res) => {
  res.render('airAverage');
});

app.get("/pmVsHum/data", async (req, res) => {
  const airs = await air.getAll()    
  let humidity = [];
  const coordinates = airs.map(obj => {
    const pollution = obj.pm10 + obj.pm2_5;
    const humidity = obj.humidity;
    return [pollution, humidity];
  });  
  const regression = Regression.linear(coordinates);
  for (let i = 0; i < airs.length; ++i) {
    let item = airs[i];
    let pollution = (item.pm10 + item.pm2_5); 
    humidity.push([pollution, item.humidity, regression.predict(pollution)[1]]);
  }
  res.json(humidity);    
});
app.get("/pmVsHum", (req, res) => {
  res.render('pmVsHum');
});

app.get("/pollution/data", (req, res) => {
  air.getAll()
    .then(airs => {
      let year = new Date(2018, 12, 0, 30, 0, 0, 0);
      let lastYear = airs.filter(d => d.date > year);
      let pollution = [];
      for (let i = 0; i < lastYear.length; ++i) {
        let item = lastYear[i];
        pollution.push([item.date, item.pm10, item.pm2_5]);
      }
      res.json(pollution);
    })
    .catch(() => {
      res.status(404).write("Not found");
      res.end();
    });
});
app.get("/pollution", (req, res) => {
  res.render('pollution');
});

app.get("/tempandhum/data", (req, res) => {
  air.getAll()
    .then(airs => {
      let year = new Date(2018, 12, 0, 30, 0, 0, 0);
      let lastYear = airs.filter(d => d.date > year);
      let pollution = [];
      for (let i = 0; i < lastYear.length; ++i) {
        let item = lastYear[i];
        pollution.push([item.date, item.temperature, item.humidity]);
      }
      res.json(pollution);
    })
    .catch(() => {
      res.status(404).write("Not found");
      res.end();
    });
});
app.get("/tempandhum", (req, res) => {
  res.render('tempAndHum');
});

app.get("/pmaverage/data", (req, res) => {
  air.getAll()
    .then(airs => {
      let averagePm10 = d3.mean(airs, d => d.pm10);
      let averagePm25 = d3.mean(airs, d => d.pm2_5);
      let data = [
        {
          'name': 'pm10',
          'amount': averagePm10
        },
        {
          'name': 'pm2_5',
          'amount': averagePm25 
        }];
      res.json(data);
    })
    .catch(() => {
      res.status(404).write("Not found");
      res.end();
    });
});
app.get("/pmaverage", (req, res) => {
  res.render('pmAverage');
});

app.get("/aircomposition/data", (req, res) => {
  air.getAll()
    .then(airs => {
      let year = new Date(2018, 12, 0, 30, 0, 0, 0);
      let lastYear = airs.filter(d => d.date > year);
      let air = [];
      for (let i = 0; i < lastYear.length; ++i) {
        let item = lastYear[i];
        air.push([item.date, item.co2, item.o2, item.ni]);
      }
      res.json(air);
    })
    .catch(() => {
      res.status(404).write("Not found");
      res.end();
    });
});
app.get("/aircomposition", (req, res) => {
  res.render('airComposition');
});


app.get("/statistics", async (req, res) => {
  const data = await air.getAll();
  const pollutionArr = data.map(obj => obj.pm10 + obj.pm2_5);
  const humidityArr = data.map(obj => obj.humidity);     
  const correlation = Correlation.calc(humidityArr, pollutionArr);
  const coordinates = data.map(obj => {
    const pollution = obj.pm10 + obj.pm2_5;
    const humidity = obj.humidity;
    return [humidity, pollution];
  });  
  const regression = Regression.linear(coordinates);
  let predictions = [];
  for(let i = 1; i < 10; i++) {
    predictions[i-1] = regression.predict(i*10);   
  }
  res.json({correlation, regression, predictions});  
});
app.get("/isairgood", async (req, res) => {
  const data = await air.getAll();
  let averageO2 = d3.mean(data, d => d.o2);
  let averageCO2 = d3.mean(data, d => d.co2);
  let resp = "";
  if(averageCO2 > 0.15) 
    resp += "Перевищено вміст CO2; ";
  else 
    resp += "CO2 в нормі;  ";
  if(averageO2 < 19.7) 
    resp += "Недостатній вміст кисню";
  else 
    resp += "O2 в нормі";
  res.json({resp});
});
app.get("/istemphumgood", async (req, res) => {
  const data = await air.getAll();
  let tempCorrect =  data.every(d => d.temperature > 22 && d.temperature < 26);
  let humCorrect = data.every(d => d.humidity > 40 && d.humidity < 60); 
  let resp = "";
  if(tempCorrect) 
    resp += "Температура повітря в нормі;  ";
  else 
    resp += "Температура повітря не задовольняє рекомандації;  ";
  if(humCorrect) 
    resp += "Вологість повітря в нормі";
  else 
    resp += "Вологість повітря не задовольняє рекомeндації  ";
  res.json({resp});
});
app.get("/isdustgood", async (req, res) => {
  const data = await air.getAll();
  let pm10Correct =  data.every(d => d.pm10 < 0.45);
  let pm2_5Correct = data.every(d => d.pm2_5 < 0.25); 
  let resp = "";
  if(pm10Correct) 
    resp += "Допустима концентрація pm10;  ";
  else 
    resp += "Перевищено допустиму концентрацію pm10;  ";
  if(pm2_5Correct) 
    resp += "Допустима концентрація pm2.5";
  else 
    resp += "Перевищено допустиму концентрацію pm2.5";
  res.json({resp});
});



app.listen(config.ServerPort, () => {
  console.clear();
  console.log(`listening on port ${config.ServerPort}`);
});