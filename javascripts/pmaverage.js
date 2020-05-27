google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            $.get('/pmaverage/data', function (response) {
                console.log(response);

                var chartData = [];
                for (var idx = 0; idx < response.length; ++idx) {
                    var item = response[idx];
                    chartData.push([item.name, item.amount]);
                }

                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Topping');
                data.addColumn('number', 'Slices');
                data.addRows(chartData);

                var options = {                    
                    title: 'Відношення дрібних частинок у приміщені:',
                    width: 1000,
                    height: 800,
                    sliceVisibilityThreshol: 0,
                    pieHole: 0.4,
                };

                var chart = new google.visualization.PieChart(document.getElementById('pmaverage_chart'));

                chart.draw(data, options);
            }, 'json');
        }