
google.charts.load('current', { 'packages': ['line'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    $.get('/aircomposition/data', function (response) {
        console.log(response);
        var lineData = [];
        for (var i = 0; i < response.length; ++i) {
            var item = response[i];
            lineData.push([new Date( Date.parse(item[0])), item[1], item[2], item[3]]);
        }
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Month');
        data.addColumn('number', "CO2");
        data.addColumn('number', "O2");
        data.addColumn('number', "N");
        data.addRows(lineData);

        var options = {
            chart: {
                title: 'Зміна складу повітря за останній рік:'
            },
            width: 1800,
            height: 700,
            series: {
                // Gives each series an axis name that matches the Y-axis below.
                0: { axis: 'CO2' }
            },
            axes: {
                // Adds labels to each axis; they don't have to match the axis names.
                y: {
                    Temps: { label: 'pm10' },
                    Daylight: { label: 'pm2.5' }
                }
            }
        };

        var chart = new google.charts.Line(document.getElementById('aircomposition_chart'));
        chart.draw(data, google.charts.Line.convertOptions(options));
    }, 'json');
}