<script setup>
import Chart from 'chart.js'
</script>

<template>
    <div>
      <canvas id="planet-chart"></canvas>
    </div>
  </template>
  
<script>


export default {
    name: 'ChartComponent',
    data() {
        return {
        planetChartData:  {
                                type: "bar",
                                data: {
                                    labels: ["10.04", "11.04", "12.04", "13.04", "14.04"],
                                    datasets: [
                                    {
                                        label: "Time",
                                        data: [1.2, 1.1, 1.15, 1.0],
                                        backgroundColor: "rgba(54,73,93,.5)",
                                        borderColor: "#36495d",
                                        borderWidth: 3
                                    },
                                    {
                                        label: "Points",
                                        data: [5,6,8,7,9],
                                        backgroundColor: "rgba(71, 183,132,.5)",
                                        borderColor: "#47b784",
                                        borderWidth: 3
                                    }
                                    ]
                                },
                                options: {
                                    responsive: true,
                                    lineTension: 1,
                                    scales: {
                                    yAxes: [
                                        {
                                        ticks: {
                                            beginAtZero: true,
                                            padding: 0
                                        }
                                        }
                                    ]
                                    }
                                }
                            }
        }
    },
    mounted() {
        const ctx = document.getElementById('planet-chart');
        new Chart(ctx, this.planetChartData);
    }
}
  </script>