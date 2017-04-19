function PowerProfiler() {

}

PowerProfiler.capture = false;
PowerProfiler.timeInSec = true;
PowerProfiler.rangeStart = 0;
PowerProfiler.interval = 0;
PowerProfiler.endTime = 0;
PowerProfiler.maxGraph = 5000;

var timeUnit = "seconds";
var chartData = [];

var chartSettings =
    {
        // title: "Power Profiler",
        // description: "Power consumtion in uA",
        backgroundColor: 'black',

        showLegend: false,
        showToolTips: true,

        enableCrosshairs: false,
        padding: { left: 5, top: 5, right: 30, bottom: 5 },
        titlePadding: { left: 30, top: 5, right: 0, bottom: 10 },
        source: chartData,
        xAxis:
        {
            //   title: { text: 'Time in ' + timeUnit },
            labels: { horizontalAlignment: 'left' },
            dataField: 'time',
            gridLinesColor: '#262626',
            showLegends: false,
            minValue: 0,
            maxValue: 0,
            enableAxisTextAnimation: true,
            alignEndPointsWithIntervals: false,
            gridLines: { step: 1 },
            valuesOnTicks: true,
            // labels: { angle: -45, offset: { x: -17, y: 0} },
            labelsFormat: '%s',
            intervalType: 'millisecond',
            Interval:0.100,
            // labels:
            //  {
            //  formatFunction: function (value) {
            //   return value.getSeconds()
            //   }
            // },
            formatFunction: function (value) {
                return value / 1000;
    },
            // type: 'time',
            baseUnit:'millisecond',
            labelsFormat: 'ss.sss',
            //  rangeSelector:
            //{
            // Uncomment the line below to render the selector in a separate container 
            // renderTo: $('#selectorContainer'),

            //  size: 80,
            //  padding: { /*left: 0, right: 0,*/top: 0, bottom: 0 },
            //  backgroundColor: 'black',
            //  opacity: 0.85,
            // backgroundImage: '../jq/images/chart_background.jpg',
            //  minValue: 0,
            //  maxValue: 0,
            //  baseUnit: timeUnit,
            //  gridLines: { visible: false },
            // serieType: 'area',
            //labelsFormat: '%s',
            //intervalType: timeUnit
            //labels:
            // {
            //  formatFunction: function (value) {
            //     return value.getSeconds()
            // }
            //}


        },
        valueAxis:
        {
            //title: { text: 'Current reading in uA' },
            labels: { horizontalAlignment: 'right' },
            gridLinesColor: '#262626',
            minValue: 0,
            maxValue: 700,
            unitInterval:100
        },
        //colorScheme: 'scheme04',
        seriesGroups: [
      {
          type: 'line',
          // toolTipFormatFunction: toolTipCustomFormatFn,

          series: [
              {
                  dataField: 'value1', displayText: 'Wireless', color: 'rgb(189,40,120)', lineWidth: 0.5,
                  labels: { visible: false },

              },
              {
                  dataField: 'value2', displayText: 'Wyzbee', color: 'rgb(66,100,159)', lineWidth: 0.5,
                  labels: { visible: false }
              },
              {
                  dataField: 'value3', displayText: 'Module', color: 'rgb(215,168, 15)', lineWidth: 0.5,
                  labels: { visible: false }
              },
              {
                  dataField: 'value4', displayText: 'MCU', color: 'rgb(57,142,35)', lineWidth: 0.5,
                  labels: { visible: false }
              }
          ]
      },
   /*   {
          type: 'line',
        
          series: [
          {
              dataField: 'value2', displayText: 'Wyzbee', color: 'rgb(66,100,159)', lineWidth: 0.5,
              labels: { visible: false }
          }
          ]
      },

          {
              type: 'line',
              series: [
             {
                 dataField: 'value3', displayText: 'Module', color: 'rgb(215,168, 15)', lineWidth: 0.5,
                 labels: { visible: false }
             }
              ]
          },
          {
              type: 'line',
              series: [

               {
                   dataField: 'value4', displayText: 'MCU', color: 'rgb(57,142,35)', lineWidth: 0.5,
                   labels: { visible: false }
               }
              ]
          } */
        ]

    };




/*
function polling() {
    var time;

    if (chartData.length) {
        time = chartData[chartData.length - 1].time + 1
    } else {
        time = 0;
    }
    chartData.push({
        time: time,
        value1: (Math.random() * 10),
        value2: (Math.random() * 15),
        value3: (Math.random() * 20),
        value4: (Math.random() * 25),
    });
    chartSettings.xAxis.rangeSelector.maxValue = chartData[chartData.length - 1].time;
    var min = chartSettings.xAxis.rangeSelector.maxValue - 10;
    if (min < 0) {
        min = 0;
    }
    chartSettings.xAxis.rangeSelector.minValue = min;

    updateChart();
};
*/

var displayPending = false;
function polling() {

    if (displayPending) {
        return;
    }
    var start = PowerProfiler.endTime;
    //  var end = start + PowerProfiler.interval;
    displayPending = true;
    displayGraph(start, 0, 1);

};


function clearGraph() {
    chartSettings.xAxis.maxValue = 0;
    chartSettings.xAxis.minValue = 0;
    chartData.splice(0, chartData.length);
    $('#chartContainer').jqxChart('refresh');
    updateChart();
}




function displayGraph(start, end, avs, callback) {
    //$('#loader').jqxLoader({ isModal: true, text: "loading...", autoOpen: true });
   // $('#loader').jqxLoader('open');
    var dispatchObject = {
        object: null,
        sync: true,
        callback: function (name, resp) {
            try {
                if (resp == "FAIL") {
                    graphPos = 0;
                    graphDepth = defGraphDepth;

                    PowerProfiler.capture = false;
                    if (pollingTimer) {
                        clearInterval(pollingTimer);
                        pollingTimer = null;
                    }
                    alert("Faild to read data from Power profiler!");
                    return;
                }
                chartData.splice(0, chartData.length);
                var arr = JSON.parse(resp);
                if (arr.length > 0) {
                    arr.map(function (item) {
                        chartData.push(item);
                    });

                    /*
                    if (chartData.length > PowerProfiler.maxGraph) {
                        chartData.splice(0, chartData.length - PowerProfiler.maxGraph);
                    }
                    */
                    PowerProfiler.endTime = arr[(arr.length - 1)].time;
                    chartSettings.xAxis.maxValue = chartData[chartData.length - 1].time;
                    chartSettings.xAxis.minValue = chartData[0].time;//chartData[0].time;
                }

            } catch (err) {
                alert(err);
            }
            $('#chartContainer').jqxChart('refresh');
            updateChart();
            displayPending = false;

            if (callback) {
                callback();
            }
          //  $('#loader').jqxLoader('close');
        }

    }
    if (avs == 1) {
        PowerProfiler.timeInSec = false;
        timeUnit = "milli seconds";
    } else {
        timeUnit = "seconds";
        PowerProfiler.timeInSec = true;
    }

    // chartSettings.xAxis.title.text = "Time in " + timeUnit;
    $('#chartContainer').jqxChart('refresh');
    dispatch("ReadBinaryFile", start + "-" + end + "-" + avs, dispatchObject);
}

var pollingTimer = null;

function startPolling(interval) {

    stopPolling();
    PowerProfiler.capture = true;
    clearGraph();
    PowerProfiler.interval = interval;
    PowerProfiler.endTime = 0;

    pollingTimer = setInterval(polling, interval);

}


function stopPolling() {
    try {
        graphPos = 0;
        graphDepth = 2600;

        PowerProfiler.capture = false;
        if (pollingTimer) {
            clearInterval(pollingTimer);
            pollingTimer = null;
            clearGraph();
            displayGraph(graphPos, graphPos + graphDepth, 1);

        }
    }
    catch (err) {
        alert(err);
    }
}

function getCSVText() {
    var text = "";
    var line = "";
    var data = chartData;
    data.map(function (item) {
        line = "";
        var count = 5;
        for (prop in item) {
            if (line) {
                line += "," + item[prop];
            } else {
                line = item[prop];
            }
            count--;
        }
        while (count > 0) {
            line += ",0";
            count--;
        }
        text += line + "\n";
    });

    return text;
}

function setCSVText(text) {
    chartData = [];
    var lines = text.split("\n");
    lines.map(function (line) {
        var fields = line.split(",");
        if (fields.length == 5) {
            chartData.push
            ({
                time: fields[0],
                value1: fields[1],
                value2: fields[2],
                value3: fields[3],
                value4: fields[4]
            });
        }
    });
    updateChart();
    return;
}

function initChart() {


    $('#chartContainer').jqxChart(chartSettings);
    // alert(chartSettings);
    // $('#chartContainer').jqxChart('showToolTips', false);
    $('#chartContainer').on("rangeSelectionChanged", function (event) {
        if (PowerProfiler.timeInSec) {
            PowerProfiler.rangeStart = event.args.minValue * 1000;
        } else {
            PowerProfiler.rangeStart = event.args.minValue;
        }
    });

    window.addEventListener("resize", function () {
        $('#chartContainer').jqxChart('refresh');
    });
}

function updateChart() {
    $('#chartContainer').jqxChart('update');


}

