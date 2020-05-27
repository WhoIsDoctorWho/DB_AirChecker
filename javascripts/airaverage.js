google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
$.get('/airaverage/data', function (response) {
    console.log(response);

    var chartData = [];
    for (var idx = 0; idx < response.length; ++idx) {
        var item = response[idx];
        chartData.push([item.name, item.amount]);
    }
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows(chartData);    

    var options = {
        title: 'Склад повітря у приміщені:',
        width: 1000,
        height: 800,
        sliceVisibilityThreshol: 0,
        is3D: true,
    };

    var chart = new google.visualization.PieChart(document.getElementById('airaverage_chart'));    
    chart.draw(data, options);
}, 'json');
}
