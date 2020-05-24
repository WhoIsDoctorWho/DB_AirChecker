function ValidateAirConstituents(items){
    return items.filter(item =>  +item.ni + +item.o2 + +item.co2 < 100);        
};
function ValidateHunidity(items){
    return items.filter(item =>  item.humidity > 0 && item.humidity < 100);        
};
function ValidateTemperature(items){
    return items.filter(item =>  item.temperature > -20 && item.temperature < 45);        
};
function ValidateDust(items){
    return items.filter(item =>  item.pm10 > 0 && item.pm2_5 > 0);        
};
function Validate(items) {
    items = ValidateAirConstituents(items);
    items = ValidateHunidity(items);
    items = ValidateTemperature(items);
    items = ValidateDust(items);
    return items;
}

module.exports = {
    Validate: Validate
};
