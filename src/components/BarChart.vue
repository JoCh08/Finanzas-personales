<template>
    <div v-if="filteredChartData && filteredChartData.labels.length > 0">
      <component
        :is="chartComponent"
        :data="filteredChartData"
        :options="chartOptions"
        :key="chartKey"
      ></component>
    </div>
    <div v-else>
      <p>No hay datos para mostrar según los filtros aplicados.</p>
    </div>
  </template>
  
  <script>
  import { ref, watch, computed } from "vue";
  import { Bar, Line, Pie } from "vue-chartjs";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    ArcElement,
  } from "chart.js";
  
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    ArcElement
  );
  
  export default {
    props: {
      chartData: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const chartKey = ref(0); // Clave reactiva para forzar el recreado del gráfico
  
      // Observar cambios en `chartData` y recrear el gráfico
      watch(
        () => props.chartData,
        () => {
          chartKey.value += 1;
        },
        { deep: true }
      );
  
      // Computed para determinar el tipo de gráfico
      const chartComponent = computed(() => {
        switch (props.chartData.chartTypedata) {
          case "line":
            return Line;
          case "pie":
            return Pie;
          default:
            return Bar;
        }
      });
  
      // Filtrar datos según `chartData.filterTypedata`
      const filteredChartData = computed(() => {
        const { labels, datasets, filterTypedata } = props.chartData;
  
        if (filterTypedata === "all") {
          return { labels, datasets }; // No filtrar
        }
  
        // Filtrar datasets según el tipo (ingresos o gastos)
        const filteredDatasets = datasets.filter((dataset) =>
          dataset.label.toLowerCase().includes(filterTypedata.toLowerCase())
        );
  
        return { labels, datasets: filteredDatasets };
      });
  
      // Opciones básicas del gráfico
      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Gráfico de Transacciones",
          },
        },
      };
  
      return {
        chartKey,
        chartComponent,
        filteredChartData,
        chartOptions,
      };
    },
  };
  </script>
  