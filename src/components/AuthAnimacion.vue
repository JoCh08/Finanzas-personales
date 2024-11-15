<script>
import { Line, Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, PointElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, PointElement, CategoryScale, LinearScale, ArcElement)

export default {
    components: {
        LineChart: Line,
        BarChart: Bar,
        PieChart: Pie
    },
    data() {
        return {
            activeChart: 0, // Variable para rastrear el gráfico visible
            charts: ['lineChart', 'barChart', 'pieChart'] // IDs de los gráficos
        }
    },
    mounted () {
        this.renderLineChart()
        this.renderBarChart()
        this.renderPieChart()
        this.startAnimation() // Iniciar la animación
    },
    methods: {
        renderLineChart() {
            const ctx = document.getElementById('lineChart').getContext('2d')
            new ChartJS(ctx, {
                type: 'line',
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    datasets: [{
                        label: 'Ganancias',
                        data: [30, 50, 40, 60, 70, 90, 100, 110, 120, 130, 140, 150],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Pérdidas',
                        data: [20, 30, 25, 35, 40, 50, 60, 70, 80, 90, 100, 110],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Gráfico Lineal'
                        }
                    }
                }
            })
        },
        renderBarChart() {
            const ctx = document.getElementById('barChart').getContext('2d')
            new ChartJS(ctx, {
                type: 'bar',
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    datasets: [{
                        label: 'Ganancias',
                        data: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Pérdidas',
                        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Gráfico de Barras'
                        }
                    }
                }
            })
        },
        renderPieChart() {
            const ctx = document.getElementById('pieChart').getContext('2d')
            new ChartJS(ctx, {
                type: 'pie',
                data: {
                    labels: ['Ganancias', 'Pérdidas'],
                    datasets: [{
                        label: 'Distribución',
                        data: [70, 30],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Gráfico de Pastel'
                        }
                    }
                }
            })
        },
        startAnimation() {
            setInterval(() => {
                this.activeChart = (this.activeChart + 1) % this.charts.length // Cambiar al siguiente gráfico
            }, 20000) // Cambiar cada 20 segundos
        }
    }
}
</script>

<template>

<div class="animacion-text">
    <h1>Bienvenido a nuestra web</h1>
    <p>Regístrate o inicia sesión para poder disfrutar de todos los beneficios</p>
    <p>Somos la mejor opción para llevar tus finanzas</p>
</div>

<div class="animacion-graficos">
    ``
    <div id="chart1" :class="{ visible: activeChart === 0 }">
        <canvas id="lineChart"></canvas>
    </div>
    <div id="chart2" :class="{ visible: activeChart === 1 }">
        <canvas id="barChart"></canvas>
    </div>
    <div id="chart3" :class="{ visible: activeChart === 2 }">
        <canvas id="pieChart"></canvas>
    </div>
</div>
</template>

<style scoped>



#chart1, #chart2, #chart3 {
    display: none;

    
}
#chart1.visible, #chart2.visible, #chart3.visible {
    display: block;
    width: 100%;
    height: 100%;
}
#chart3 {
    max-width: 70vh;
    max-height: 70vh;
    
    margin: 0 auto;
}

.animacion-graficos {
    display: none;
  
}
@media (min-width: 768px ) {
    .animacion-graficos {
        display: block;
       
    }
}


</style>
