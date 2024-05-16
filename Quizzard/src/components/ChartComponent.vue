<script setup>
import Chart from 'chart.js'
</script>

<template>
    <div>
      <canvas id="myChart"></canvas>
    </div>
  </template>
  
<script>
export default {
    name: 'ChartComponent',
    props: {
        pData: {
            type: Object,
            required: true,
        },
    },
  watch: {
    pData(newValue, oldValue) {
        console.log(newValue)
      // This function will be called whenever myProp changes
      this.renderChart()
    }
  },
  methods: {
    renderChart() {
        console.log(this.pData)
      const ctx = document.getElementById('myChart').getContext('2d');
      const chartLabels = [];
      const chartData = [];

      this.pData.forEach(data => {
        chartLabels.push(data.Playdate);
        chartData.push(data.Points);
      });

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Value',
            data: chartData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                suggestedMax: this.pData[0].MaxPoints,
                beginAtZero: true
              }
            }]
          }
        }
      });
    }
  }
};
</script>