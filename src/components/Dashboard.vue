

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from "@/composables/useAuth.js";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import BarChart from "../components/BarChart.vue"; // Componente para mostrar el gráfico de barras
import { auth } from "@/firebase"; // Importación de la autenticación de Firebase

const { user } = useAuth()

const filterType = ref("all");
const chartType = ref("bar");
const startDate = ref("");
const endDate = ref("");

// Estado reactivo para almacenar los datos del gráfico
const chartData = ref({
    filterTypedata: filterType ,
    chartTypedata: chartType,
    labels: [], // Fechas únicas en el eje X
    datasets: [
        {
            label: "Gastos",
            backgroundColor: "rgb(0, 123, 167)", // Azul jade fuerte
            data: [] // Total de gastos por cada fecha en `labels`
        },
        {
            label: "Ingresos",
            backgroundColor: "rgb(102, 204, 153)", // Verde jade suave
            data: [] // Total de ingresos por cada fecha en `labels`
        }
    ]
});

// Inicializar la base de datos de Firebase
const db = getDatabase();



const collectData = () => {
    console.log("Filter Type:" + filterType.value);
    console.log("Chart Type:" + chartType.value);
    console.log("Start Date:" + startDate.value);
    console.log("End Date:" + endDate.value);

    if (startDate.value && endDate.value) {
        if (startDate.value > endDate.value) {
            console.log("La fecha de inicio no puede ser mayor a la fecha de fin");
            alert("La fecha de inicio no puede ser mayor a la fecha de fin");
            return;
        }
    }

    fetchData(user.value.uid);
};

const fetchData = (userUid) => {
    const transactionsRef = dbRef(db, `transactions/${userUid}`);

    onValue(transactionsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return console.log("No hay datos");

        // Resetear los datos del gráfico
        chartData.value.labels = [];
        chartData.value.datasets[0].data = []; // Gastos
        chartData.value.datasets[1].data = []; // Ingresos

        let currentFecha = null; // Fecha actual en el recorrido
        let sumGastos = 0; // Suma acumulada de gastos para la fecha actual
        let sumIngresos = 0; // Suma acumulada de ingresos para la fecha actual

        // Recorrer los datos transaccionales
        for (const key in data) {
            const { type, amount, date } = data[key];
            const formattedDate = new Date(date).toISOString().slice(0, 10); // Formato 'YYYY-MM-DD'

            // Si cambia la fecha, guardar los resultados y resetear acumuladores
            if (currentFecha !== formattedDate) {
                if (currentFecha) {
                    // Agregar datos acumulados para la fecha anterior
                    chartData.value.labels.push(currentFecha);
                    chartData.value.datasets[0].data.push(sumGastos); // Gastos
                    chartData.value.datasets[1].data.push(sumIngresos); // Ingresos
                }

                // Actualizar la nueva fecha y resetear acumuladores
                currentFecha = formattedDate;
                sumGastos = 0;
                sumIngresos = 0;
            }

            // Sumar los valores según el tipo de transacción
            if (type === "ingresos") {
                sumIngresos += amount;
            } else if (type === "gasto") {
                sumGastos += amount;
            }
        }

        // Agregar la última fecha y sus acumulados
        if (currentFecha) {
            chartData.value.labels.push(currentFecha);
            chartData.value.datasets[0].data.push(sumGastos); // Gastos
            chartData.value.datasets[1].data.push(sumIngresos); // Ingresos
        }

        console.log("Datos del gráfico generados:", chartData.value);
    });
};



// Ejecutar `fetchData` cuando el componente se monta, después de verificar la autenticación del usuario
onMounted(() => {//onMounted es un hook que se ejecuta cuando el componente se monta
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
    <div class=" dash-text" >
        <h1 class="title-dash"> Bienvenido </h1>

        <h2 v-if="user" class="title-dash-user ">Hola de nuevo  {{ user.displayName }},  <br> aqui podras ver tus finanzas represantadas en graficos </h2>

    </div>

    <div class="opciones">

        <div class="filter-options flex">
            <label for="filterType">Filtrar por:</label>
            <select id="filterType" v-model="filterType">
                <option value="all">Mostrar Todo</option>
                <option value="gastos">Mostrar Gastos</option>
                <option value="ingresos">Mostrar Ingresos</option>
            </select>
        </div>

    <div class="chart-options flex" >
        <label for="chartType">Tipo de Gráfica: <br>
        </label>
        <select id="chartType" v-model="chartType">
            <option value="bar">Grafica de tipo Barra</option>
            <option value="line">Grafica de tipo Línea</option>
            <option value="pie">Grafica de tipo Pastel</option>
       
        </select>
    </div>

    <div class="date-filters">
         <label for="filterType">Fechas:</label>
        <label for="startDate"> Inicio:</label>

        <input type="date" id="startDate" v-model="startDate" />
        <label for="endDate"> Fin:</label>
        <input type="date" id="endDate" v-model="endDate" />
       
    </div>

    <button class="vintage-button" @click="collectData">Aplicar Filtro de Fechas</button>
</div>
  
    <div class="graf-dash"  v-if="chartData && chartData.labels.length > 0"> 
        <BarChart 
        :chartData="chartData"
      
        
        /> 
    </div>


   

</div>


<footer> Todos los derechos recervados </footer>
</template>

<style scoped>
    .flex {
        display: flex;
        flex-direction: column;
    }

    .title-dash {
        text-align: center;
        margin-top: 2rem;
        font-size: 5rem;
        color: #3b5249; /* Verde jade oscuro */
    }

    .title-dash-user {
        text-align: center;
        margin-top: 2rem;
        font-size: 3rem;
    }
    .title-dash-user h2 {
        color: #4d6d6b; /* Azul jade apagado */
        font-weight: bold;
    }

    .title-dash-user span {
        text-align: center;
        font-size: 2rem;
        color: #5a433c; /* Marrón oscuro vintage */
    }
    
    .graf-dash {
        width: 80%;
        margin: 2rem auto;
        background: radial-gradient(circle, rgba(240, 234, 214, 1) 0%, rgba(91, 141, 119, 1) 50%, rgba(77, 109, 107, 1) 100%);
        box-shadow: 2px 8px 10px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
    }

    .dash {
        display: flex;
        flex-direction: column;
        height: auto;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, rgba(0, 123, 167, 0.8), rgba(102, 204, 153, 0.8));
    }

    footer {
        text-align: center;
        font-size: 0.9rem;
        color: #3b5249; /* Verde jade oscuro */
    }

    .opciones {
        background-color: #5b8c75; /* Verde jade oscuro */
        border: 2px solid #4d6d6b; /* Azul jade apagado */
        border-radius: 10px;
        padding: 20px;
        margin: 20px auto;
        width: 90%;
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2); /* Sombra más marcada */
    }

    @media (min-width: 768px) {
        .opciones {
            max-width: 70rem;
        }
    }

    .opciones label {
        font-size: 16px;
        color: #3b5249; /* Verde jade oscuro */
        margin-right: 15px;
    }

    .chart-options label {
        display: inline-block;
        margin: 10px 0;
        color: #5a433c; /* Marrón oscuro vintage */
    }

    input[type="radio"] {
        margin-right: 5px;
    }

    select, 
    input[type="date"] {
        font-family: 'Georgia', serif;
        padding: 8px;
        border: 1px solid #4d6d6b; /* Azul jade apagado */
        border-radius: 5px;
        background-color: #f1ebdf; /* Fondo cálido claro */
        color: #3b5249; /* Verde jade oscuro */
        margin-right: 10px;
        margin-top: 5px;
    }

    .vintage-button {
        background-color: #4d6d6b; /* Azul jade apagado */
        color: #ffffff;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'Georgia', serif;
        font-size: 16px;
        margin-top: 10px;
        transition: background-color 0.3s, transform 0.2s;
    }

    .vintage-button:hover {
        background-color: #3b5249; /* Verde jade oscuro */
        color: #f1ebdf; /* Fondo cálido claro */
        transform: translateY(-2px); /* Efecto sutil al pasar el cursor */
    }

    .chart-options {
        margin-top: 20px;
    }

    .date-filters label {
        display: inline-block;
        margin-right: 10px;
        margin-top: 10px;
        color: #5a433c; /* Marrón oscuro vintage */
    }

    .date-filters {
        margin-top: 20px;
        display: flex;  
        flex-direction: column;
    }

    @media (min-width: 768px) {
        .date-filters {
            flex-direction: row;
        }
    }
</style>
