<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isAuthenticated = ref(false)
const router = useRouter()

onAuthStateChanged(auth, (user) => {
  isAuthenticated.value = !!user
})
const logout = async () => {
  await signOut(auth)
  isAuthenticated.value = false
  router.push('/auth')
}
</script>

<template>
  <header>
    <nav v-if="isAuthenticated">
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/transaction">Transactions</RouterLink>
      <button @click="logout">Logout</button>
    </nav>
  </header>
  <main>
    

      <RouterView />

  

  </main>

</template>

<style scoped>

nav {
  margin: 4rem;
  text-align: center;
  display: flex;
  gap: 2rem;
  justify-content: center;
  font-size: 2.4rem;
  background-color: #f4f4f4;
  border: 2px solid #2a9d8f; /* Jade blue color */
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

nav a {
  color: #2a9d8f; /* Jade blue color */
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

nav a:hover {
  color: #264653; /* Darker shade for hover effect */
}

button {
  background-color: #2a9d8f; /* Jade blue color */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #264653; /* Darker shade for hover effect */
}

main {
 

  font-family: 'Courier New', Courier, monospace; /* Vintage font */
  color: #96f8a4; /* Jade blue color */
}


</style>