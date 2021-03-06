google.charts.load('current', { 'packages': ['line'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            $.get('/tempandhum/data', function (response) {
                console.log(response);
                var lineData = [];
                for (var i = 0; i < response.length; ++i) {
                    var item = response[i];
                    lineData.push([new Date( Date.parse(item[0])), 20, 25, 40, 60, item[1], item[2]]);
                }
                var data = new google.visualization.DataTable();
                data.addColumn('date', 'Month');
                data.addColumn('number', "Normal Temperature (low param)");
                data.addColumn('number', "Normal Temperature (high param)");
                data.addColumn('number', "Normal Humidity (low param)");
                data.addColumn('number', "Normal Humidity (high param)");
                data.addColumn('number', "Temperature");
                data.addColumn('number', "Humidity");

                console.log(typeof lineData[0][0]);
                data.addRows(lineData);

                var options = {
                    chart: {
                        title: 'Показники температури і вологості за останній рік:'
                    },
                    width: 1800,
                    height: 700,
                    axes: {                      
                        y: {
                            Temps: { label: 'Temperature' },
                            Daylight: { label: 'Humidity' }
                        }
                    }
                };

                var chart = new google.charts.Line(document.getElementById('tempandhum_chart'));
                chart.draw(data, google.charts.Line.convertOptions(options));
            }, 'json');
        }