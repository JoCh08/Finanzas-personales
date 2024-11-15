

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from "@/composables/useAuth.js";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import BarChart from "../components/BarChart.vue"; // Componente para mostrar el gráfico de barras
import { auth } from "@/firebase"; // Importación de la autenticación de Firebase

// Estado reactivo para almacenar los datos del gráfico
const chartData = ref({
    labels: [], // Fechas únicas en el eje X
    datasets: [
        {
            label: "Gastos",
            backgroundColor: "rgb(255, 99, 132)",
            data: [] // Total de gastos por cada fecha en `labels`
        },
        {
            label: "Ingresos",
            backgroundColor: "rgb(54, 162, 235)",
            data: [] // Total de ingresos por cada fecha en `labels`
        }
    ]
});

// Inicializar la base de datos de Firebase
const db = getDatabase();

const fetchData = (userUid) => {
    const transactionsRef = dbRef(db, `transactions/${userUid}`);

    onValue(transactionsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return console.log("No hay datos");

        // Objeto para agrupar los totales de ingresos y gastos por fecha
        const groupedData = {};

        // Recorrer cada transacción y agrupar por fecha
        for (const key in data) {
            const { type, amount, date } = data[key];
            const formattedDate = new Date(date).toISOString().slice(0, 10); // Formato 'YYYY-MM-DD'

            // Inicializar la fecha en `groupedData` si no existe
            if (!groupedData[formattedDate]) {
                groupedData[formattedDate] = { ingresos: 0, gastos: 0 };
            }

            // Sumar el monto en ingresos o gastos según el tipo de transacción
            if (type === 'ingresos') {
                groupedData[formattedDate].ingresos += amount;
            } else if (type === 'gasto') {
                groupedData[formattedDate].gastos += amount;
            }
        }

        // Convertir `groupedData` a arreglos para `chartData`
        const labels = [];
        const ingresos = [];
        const gastos = [];

        // Ordenar las fechas y llenar los datos
        Object.keys(groupedData)
            .sort((a, b) => new Date(a) - new Date(b))
            .forEach(date => {
                labels.push(date); // Añadir cada fecha única
                ingresos.push(groupedData[date].ingresos); // Total de ingresos para la fecha
                gastos.push(groupedData[date].gastos); // Total de gastos para la fecha
            });

        // Actualizar `chartData` para el gráfico
        chartData.value = {
            labels, // Fechas únicas en orden cronológico
            datasets: [
                {
                    label: "Gastos",
                    backgroundColor: "rgb(255, 99, 132)",
                    data: gastos
                },
                {
                    label: "Ingresos",
                    backgroundColor: "rgb(54, 162, 235)",
                    data: ingresos
                }
            ]
        };
    });
};


// Ejecutar `fetchData` cuando el componente se monta, después de verificar la autenticación del usuario
onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            fetchData(user.uid); // Llamar a `fetchData` con el UID del usuario
        } else {
            console.log("No hay un usuario autenticado");
        }
    });
});
</script>


<template>
<div class="dash">
    
    <h1 class="title-dash"> Bienvenido</h1>
    <h2 v-if="user" class="title-dash-user ">Es un gusto saludarte, {{ user.displayName }} <br> <span> aqui encontraras todo sobre tus finanzas</span>  </h2>
  
    <div class="graf-dash"  v-if="chartData && chartData.labels.length > 0"> 
        <BarChart :chartData="chartData" /> 
    </div>




</div>



</template>

<style scoped>

    .title-dash {
        text-align: center;
        margin-top: 2rem;
        font-size: 5rem;
    }
    .title-dash-user {
        text-align: center;
        margin-top: 2rem;
        font-size: 3rem;
    }

    .title-dash-user span {
        text-align: center;

        font-size: 2rem;
    }
    
    .graf-dash {
        width: 80%;
        margin: 0 auto;
    }

    .dash {
        display: flex;
        flex-direction: column;
        background-color: #005e30;
        height: 100vh;
        justify-content: center;
        justify-content: center;
    }

</style>