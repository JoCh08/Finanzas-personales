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


</script>

<template>
 <h1>Añadir transacción</h1>
 <form @submit.prevent="addTransaction">
 <div>
    <label style="margin-right: 5px">Tipo de transacción</label>
    <select v-model="type" id="">
       <option value="ingresos">Ingreso</option>
       <option value="gasto">Gasto</option>
    </select>
 </div>
<div>
    <label style="margin-right: 5px">Cantidad</label>
    <input v-model="amount" type="number" required>
</div>
<button type="submit">Agregar transacción</button>
</form>

<div v-if="transactions.length > 0" class="vintage-container">
    <h2>Últimas 3 transacciones</h2>
    <ul>
        <li v-for="transaction in transactions.slice(-3)" :key="transaction.id" class="vintage-item">
            {{ transaction.date }} - {{ transaction.type }}: ${{ transaction.amount }}
        </li>
    </ul>
</div>

</template>

<style scoped>
body {
    font-family: 'Courier New', Courier, monospace;
    background-color: #f4f4f4;
    color: #2e4a62;
}

h1 {
    color: #2e4a62;
    text-align: center;
    font-size: 2em;
    margin-bottom: 20px;
}

form {
    background-color: #e0e0e0;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 0 auto;
}

label {
    font-weight: bold;
    color: #2e4a62;
}

input, select {
    width: calc(100% - 10px);
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #2e4a62;
    border-radius: 5px;
    background-color: #f4f4f4;
    color: #2e4a62;
}

button {
    background-color: #2e4a62;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
}

button:hover {
    background-color: #1e3a52;
}

.vintage-container {
    background-color: #fdf5e6;
    border: 1px solid #d4af37;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 20px auto;
    font-family: 'Courier New', Courier, monospace;
}

.vintage-item {
    background-color: #fff8dc;
    border: 1px solid #d4af37;
    padding: 10px;
    border-radius: 5px;
    margin: 5px 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>