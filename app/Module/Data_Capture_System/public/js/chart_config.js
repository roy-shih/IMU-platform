function getAvgConfig( ){

    const avg = {
        type: 'line',
        borderColor: 'rgb(100, 149, 237)',
        borderDash: [6, 6],
        borderDashOffset: 0,
        borderWidth: 3,
        label: {
            enabled: true,
            backgroundColor: 'rgb(100, 149, 237)',
            content: (ctx) => 'Average: ' + average(ctx).toFixed(2)
        },
        scaleID: 'y',
        value: (ctx) => average(ctx)
    };
    return avg;
}

function getStdUpper( ){
    const std_upper = {
        type: 'line',
        borderColor: 'rgba(102, 102, 102, 0.5)',
        borderDash: [6, 6],
        borderDashOffset: 0,
        borderWidth: 3,
        label: {
            enabled: true,
            backgroundColor: 'rgba(102, 102, 102, 0.5)',
            color: 'black',
            content: (ctx) => (average(ctx) + standardDeviation(ctx)).toFixed(2),
            position: 'start',
            // rotation: -90,
            yAdjust: -10
        },
        scaleID: 'y',
        value: (ctx) => average(ctx) + 2 * standardDeviation(ctx)
    };
    return std_upper;
}

function getStdLower( ){

    const std_lower = {
        type: 'line',
        borderColor: 'rgba(102, 102, 102, 0.5)',
        borderDash: [6, 6],
        borderDashOffset: 0,
        borderWidth: 3,
        label: {
            enabled: true,
            backgroundColor: 'rgba(102, 102, 102, 0.5)',
            color: 'black',
            content: (ctx) => (average(ctx) - standardDeviation(ctx)).toFixed(2) + `(${standardDeviation(ctx).toFixed(2)})`,
            position: 'end',
            // rotation: 90,
            yAdjust: 10
        },
        scaleID: 'y',
        value: (ctx) => average(ctx) - 2 * standardDeviation(ctx)
    };
    return std_lower;
}

function average(ctx) {
    var values = ctx.chart.data.datasets[0].data;
    return values.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / values.length;
}

function standardDeviation(ctx) {
    const values = ctx.chart.data.datasets[0].data;
    const n = values.length;
    const mean = average(ctx);
    const std = Math.sqrt(values.map(x => Math.pow(parseFloat(x) - mean, 2)).reduce((a, b) => parseFloat(a) + parseFloat(b)) / n)
    ctx.chart.options.plugins.title.text = `avg:${mean.toFixed(2)}          std:${std.toFixed(2)}`;
    return std;
}

function getHRConfig() {

    let heartrateConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "HR",
                data: [],
                borderColor: "#f01f01",
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            }]
        },
        options: {

            responsive: true,
            plugins: {
                title: {
                    display: false,
                    text: 'avg:-- std:--'
                },
                annotation: {
                    annotations: {
                        avg: getAvgConfig(),
                        std_upper: getStdUpper( ),
                        std_lower: getStdLower( )
                    }
                },
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: false,
                    title: {
                        display: false,
                    }
                }, 
                y: {
                    stacked: true,
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    // suggestedMin: 60,
                    // suggestedMax: 120,
                }
            },

        },
    };
    return heartrateConfig;
}

function getSpo2Config(){

    let spo2Config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "SPO2",
                data: [],
                borderColor: "#123312",
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: false,
                    text: 'avg:-- std:--'
                },
                annotation: {
                    annotations: {
                        avg: getAvgConfig(),
                        std_upper: getStdUpper( ),
                        std_lower: getStdLower( )
                    }
                },
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
            }, scales: {
                x: {
                    display: false,
                    title: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    // suggestedMin: 95,
                    // suggestedMax: 100,
                }
            },
        },
    };
    return spo2Config;
}

function getTemperatureConfig( ){

    let temperatureConfig = {
        type: 'line',
        data: {
            labels: [0],
            datasets: [{
                label: "Temperature",
                data: [0],
                borderColor: "#acacac",
                fill: false,
                cubicInterpolationMode:
                    'monotone',
                tension: 0.4
            }]
        }, options: {
            responsive: true,
            plugins: {
                title: {
                    display: false,
                    text: 'avg:-- std:--'
                },
                annotation: {
                    annotations: {
                        avg: getAvgConfig(),
                        std_upper: getStdUpper( ),
                        std_lower: getStdLower( )
                    }
                },
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: false,
                    title: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    // suggestedMin: 35,
                    // suggestedMax: 40,
                }
            },
        }
    };
    return temperatureConfig;
}
function getBPConfig( ){

    let bpConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "SBP",
                data: [],
                borderColor: "#39ac01",
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            }, {
                label: "DBP",
                data: [],
                borderColor: "#acacac",
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            }, {
                label: "MAP",
                data: [],
                borderColor: "#665543",
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: false,
                    text: 'LineChart'
                }
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: false,
                    title: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    // suggestedMin: -10,
                    // suggestedMax: 20,
                }
            },
        }
    };
    return bpConfig;
}
function getRespConfig( ){

    let respConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Resp",
                data: [],
                borderColor: "#665543",
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            // plugins: {
            //     title: {
            //         display: false,
            //         text: 'LineChart'
            //     },
            //     legend: {
            //         display: false,
            //     }
            // },
            plugins: {
                title: {
                    display: false,
                    text: 'avg:-- std:--'
                },
                annotation: {
                    annotations: {
                        avg:       getAvgConfig(),
                        std_upper: getStdUpper(),
                        std_lower: getStdLower()
                    }
                },
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: false,
                    title: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    // suggestedMin: -10,
                    // suggestedMax: 200,
                }
            },
        }
    };
    return respConfig;
}

