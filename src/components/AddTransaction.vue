<script setup>
import { ref , onMounted} from 'vue'
import { getDatabase, ref as dbRef, push,onValue } from "firebase/database";
import { auth  } from '../firebase.js'

const type = ref('ingresos')
const amount = ref(0)
const db = getDatabase();

const addTransaction = async () => {
    const user = auth.currentUser
    if(user && amount.value != null){ 
        const transactionsRef = dbRef(db, `transactions/${user.uid}`);
            
    const newTransaction = {
        type: type.value,
        amount: amount.value,
        date: new Date().toISOString().slice(0, 10),
        userId: user.uid
    }
    await push(transactionsRef, newTransaction)
     
     alert('Transacción agregada')
    
    amount.value = null
    } else {
        alert('Debes ingresar una cantidad valida')
    }
}

const transactions = ref([])

 onMounted(() => {
    const user = auth.currentUser
    if (user) {
        const transactionsRef = dbRef(getDatabase(), `transactions/${user.uid}`);
        onValue(transactionsRef, (snapshot) => {
            const data = snapshot.val();
            transactions.value = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        });
    }
}); 

const getIngresos = () => {
    return transactions.value
        .filter(transaction => transaction.type === 'ingresos')
        .map(transaction => ({
            date: transaction.date,
            amount: transaction.amount
        }));
};
const getGastos = () => {
    return transactions.value
        .filter(transaction => transaction.type === 'gasto')
        .map(transaction => ({
            date: transaction.date,
            amount: transaction.amount
        }));
};
const getBalance = () => {
  const totalIngresos = transactions.value
    .filter(transaction => transaction.type === 'ingresos')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalGastos = transactions.value
    .filter(transaction => transaction.type === 'gasto')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return `${totalIngresos}  - ${totalGastos} = ${totalIngresos - totalGastos}`;
};

</script>

<template>
 
    <div class="contenido-addtrans">

      <h1 class="vintage-title">Añadir transacción</h1>

        <form @submit.prevent="addTransaction" class="vintage-form">
      <div class="vintage-form-group">
        <label>Tipo de transacción</label>
        <select v-model="type">
          <option value="ingresos">Ingreso</option>
          <option value="gasto">Gasto</option>
        </select>
      </div>
      <div class="vintage-form-group">
        <label>Cantidad</label>
        <input v-model="amount" type="number" required />
      </div>
      <button type="submit" class="vintage-button">Agregar transacción</button>
    </form>
  
   
  
    <div class="transactions-section" v-if="transactions.length > 0" >

        <div class="vintage-container">
      <h2>Últimas 3 transacciones</h2>
      <ul class="vintage-list">
        <li v-for="transaction in transactions.slice(-3)" :key="transaction.id" class="vintage-item">
          {{ transaction.date }} - {{ transaction.type }}: ${{ transaction.amount }}
        </li>
      </ul>
      <h2> Estado de tus finanzas </h2>
      <p>{{ getBalance() }}</p>
    </div>


    <div class="vintage-subcontainer-content">
        
        <h2 class="vintage-subtitle">Todos los ingresos</h2>
        <div class="vintage-subcontainer">
        <ul class="vintage-list">
          <li v-for="ingreso in getIngresos()" :key="ingreso.date" class="vintage-item">
            {{ ingreso.date }} - ${{ ingreso.amount }}
          </li>
        </ul>
      </div>

    </div>
    

  
      

      <div class="vintage-subcontainer-content">
        <h2 class="vintage-subtitle">Todos los gastos</h2>
        <div class="vintage-subcontainer">
       
        <ul class="vintage-list">
          <li v-for="gasto in getGastos()" :key="gasto.date" class="vintage-item">
            {{ gasto.date }} - ${{ gasto.amount }}
          </li>
        </ul>
      </div>

      </div>

    </div>









    </div>
   
  </template>
  
  <style scoped>
  /* General Styles */
  body {
    font-family: 'Courier New', Courier, monospace;
    background-color: #1e2a34; /* Fondo oscuro */
    color: #e8e8e8; /* Texto claro */
    margin: 0;
    padding: 20px;
  }
  
  /* Títulos */
  .vintage-title {
    color: #cbf5e6; /* Azul jade */
    text-align: center;
    font-size: 2.5em;
    margin-bottom: 30px;
    font-style: bold;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  .vintage-subtitle {
    color: #8ab5a7; /* Azul jade claro */
    font-size: 1.8em;
    margin-bottom: 15px;
    text-align: center;
  }
  
  /* Formulario */
  .vintage-form {
    background-color: #2c3e50; /* Fondo oscuro del formulario */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    margin: 0 auto 30px auto;
  }
  
  .vintage-form-group {
    margin-bottom: 20px;
  }
  
  label {
    font-weight: bold;
    color: #b3c7c2; /* Texto en azul jade suave */
    display: block;
    margin-bottom: 5px;
  }
  
  input,
  select {
    width: 100%;
    padding: 10px;
    margin: 0;
    border: 1px solid #8ab5a7; /* Azul jade claro */
    border-radius: 5px;
    background-color: #1e2a34; /* Fondo oscuro */
    color: #e8e8e8; /* Texto claro */
    font-size: 1em;
  }
  
  input:focus,
  select:focus {
    border-color: #76b39d; /* Azul jade brillante */
    outline: none;
    box-shadow: 0 0 5px rgba(118, 179, 157, 0.5);
  }
  
  .vintage-button {
    background-color: #76b39d; /* Azul jade */
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.2em;
    transition: background-color 0.3s ease;
    width: 100%;
  }
  
  .vintage-button:hover {
    background-color: #5a8f79; /* Azul jade oscuro */
  }
  
  /* Contenedores */
  .transactions-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 30px;
  }
  @media (min-width: 768px ) {
      .transactions-section{
            flex-direction: row;
            justify-content: space-between;
      }
  }
  
  .vintage-container {
    background-color: #2a2f33; /* Fondo oscuro para contenedores */
    border: 1px solid #8ab5a7; /* Borde azul jade */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    margin: 20px auto;
    text-align: center;
  }
  
  .vintage-subcontainer-content{
    flex: 1;
    background-color: #2c3e50; /* Fondo oscuro para ingresos y gastos */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    margin: 0 auto;


  }

  .vintage-subcontainer {
    
    max-height: 300px;
    overflow-y: auto;
    scrollbar-width: thin; /* Firefox */
    scrollbar-color: #76b39d #2c3e50; /* Firefox */

  }
  
  /* Listas */
  .vintage-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .vintage-item {
    background-color: #3b4c4f; /* Azul jade oscuro */
    border: 1px solid #76b39d; /* Borde azul jade brillante */
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
    color: #e8e8e8;
    font-size: 1.1em;
    text-align: left;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  </style>
  