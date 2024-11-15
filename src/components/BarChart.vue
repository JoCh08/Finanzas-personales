<script setup>
import { ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
    chartData: {
        type: Object,
        required: true
    }
});

const chartKey = ref(0);

// Configurar el tooltip personalizado
const options = {
    plugins: {
        tooltip: {
            callbacks: {
                label: function(context) {
                    return `${context.dataset.label}: $${context.raw}`;
                }
            }
        }
    },
    responsive: true,
    maintainAspectRatio: false,
};



watch(
    () => props.chartData,
    () => {
        chartKey.value += 1; // Incrementar la clave para forzar el recreado del gráfico
    },
    { deep: true }
);
</script>

<template>
    <div class="title-grafico">
        <h1>Gráfico de Transacciones</h1>
    </div>
    <div class="grafico" v-if="chartData && chartData.labels.length > 0">
        <Bar :data="chartData" :options="options" :key="chartKey" />
    </div>
</template>

<style scoped>
.title-grafico {
    text-align: center;
    margin-top: 2rem;
    font-size: 2rem;
    color: #fff;
}
.grafico {
    width: 80%;
    margin: 0 auto;
}
</style>
