google.charts.load('current', {'packages':['scatter']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            $.get('/pmVsHum/data', function (response) {
                console.log(response);

                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('number', 'Pollution');
                data.addColumn('number', 'Humidity');
                data.addColumn('number', 'Regression');
                data.addRows(response);

                var options = {
                    title: 'Залежність забрудненості від вологості:',
                    width: 1000,
                    height: 800,
                    hAxis: { title: 'Pollution' },
                    vAxis: { title: 'Humidity' },
                };

                var chart = new google.charts.Scatter(document.getElementById('pmvshum_chart'));

                chart.draw(data, google.charts.Scatter.convertOptions(options));
            }, 'json');
        }