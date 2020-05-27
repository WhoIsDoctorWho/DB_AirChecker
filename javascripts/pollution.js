google.charts.load('current', { 'packages': ['line'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            $.get('/pollution/data', function (response) {
                console.log(response);
                var lineData = [];
                for (var i = 0; i < response.length; ++i) {
                    var item = response[i];
                    lineData.push([new Date( Date.parse(item[0])), 0.25, 0.45, item[1], item[2]]);
                }
                var data = new google.visualization.DataTable();
                data.addColumn('date', 'Month');
                data.addColumn('number', "max pm2.5");
                data.addColumn('number', "max pm10");
                data.addColumn('number', "pm10");
                data.addColumn('number', "pm2.5");

                console.log(typeof lineData[0][0]);
                data.addRows(lineData);

                var options = {
                    chart: {
                        title: 'Забрудненість повітря дрібними частинками за останній рік:'
                    },
                    width: 1800,
                    height: 700,
                    axes: {                        
                        y: {
                            Temps: { label: 'pm10' },
                            Daylight: { label: 'pm2.5' }
                        }
                    }
                };
                var my_div = document.getElementById('pollution_chart');                
                var chart = new google.charts.Line(my_div);                
                chart.draw(data, google.charts.Line.convertOptions(options));
            }, 'json');
        }