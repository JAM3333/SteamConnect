<script setup>
import Chart from 'chart.js'
</script>

<template>
    <div v-if="plotEnabled">
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
      plotEnabled: {
        type: Boolean,
        required: true,
      }
  },
  watch: {
    pData(newValue, oldValue) {
      // This function will be called whenever myProp changes
      this.renderChart()
    }
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById('myChart').getContext('2d');
      const chartLabels = [];
      const chartData = [];

      this.pData.reverse()
      this.pData.forEach(data => {
        chartLabels.push(data.Playdate.toString().substring(0,10));
        chartData.push(data.Points);
        //chartData.push(data.Playtime);
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
                beginAtZero: true,
                stepSize: 1,
              }
            }]
          },
          responsive: true,
          maintainAspectRatio: false,
          height: 1000,
        }
      });
    }
  }
};
</script>


<style scoped>
#myChart {
  height: 400px;
  width: 600px;
}
</style>