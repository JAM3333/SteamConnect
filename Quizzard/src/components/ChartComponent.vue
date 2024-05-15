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
    props: {
        labels: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
        planetChartData:  {
                                type: "bar",
                                data: {
                                    labels: labels,
                                    datasets: [
                                    {
                                        label: "Time",
                                        data: [1.2, 1.1, 1.15, 1.0],
                                        backgroundColor: "rgba(54,73,93,.5)",
                                        borderColor: "#36495d",
                                        borderWidth: 3
                                    },
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
        console.log(this.labels)
        const ctx = document.getElementById('planet-chart');
        new Chart(ctx, this.planetChartData);
    }
}
</script>