<script setup>
    import {ref} from 'vue'
    import{auth} from '../firebase.js'
  //import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';
    import { useRouter } from 'vue-router'
    
    import { useAuth } from '@/composables/useAuth.js'
   
    import AuthAnimacion from './AuthAnimacion.vue'
    
   const isLogin = ref(true);
   const email = ref('');
   const password = ref('');
    const username = ref('');
    const router = useRouter();

    const { login, register, signInWithGoogle} = useAuth();
    
    const toggleAuth = () => {
        isLogin.value = !isLogin.value
    }

   const handleSubmit = async () => {
        try {
            if(isLogin.value){
                //await signInWithEmailAndPassword(auth, email.value, password.value)
              await login( email.value, password.value)
            } else {
                await register( email.value, password.value, username.value)
               // await createUserWithEmailAndPassword(auth, email.value, password.value)
            }
            router.push('/')
        } catch (error) {
            
        }
    }

</script>
<template>
    <div class="auth-container">
      <div class="auth-container1">

        <AuthAnimacion/>

      </div>
  
      <div class="auth-container2">
        <div class="auth-container-form">
          <h1>{{ isLogin ? "Iniciar Sesión" : "Registro" }}</h1>
          <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="inputs">
              <div v-if="!isLogin">
                <label for="username">Nombre de Usuario</label>
                <input id="username" v-model="username" type="text" required placeholder="Ingresa tu nombre de usuario">
              </div>
              <div>
                <label for="email">Correo Electrónico</label>
                <input id="email" v-model="email" type="email" required placeholder="Ingresa tu correo electrónico">
              </div>
              <div>
                <label for="password">Contraseña</label>
                <input id="password" v-model="password" type="password" required placeholder="Ingresa tu contraseña">
              </div>
              <button type="submit" class="submit-button">{{ isLogin ? "Iniciar Sesión" : "Registrarse" }}</button>
              <button type="button" class="google-button" @click="signInWithGoogle">Iniciar sesión con Google</button>

            </div>

         

          </form>
          <p class="toggle-auth" @click="toggleAuth">{{ isLogin ? "¿Aún no tienes una cuenta? Regístrate" : "¿Ya tienes una cuenta? Inicia sesión" }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>

  .auth-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    background-color: #f4f1ea;
  }
  
  @media (min-width: 768px) {
    .auth-container {
      flex-direction: row;
    
    }
  }
  
  .auth-container1 {
     display: flex;
     flex-direction: column;
     align-items: space-between;
     justify-content: center;
    MIN-width: 70%;
    background-color: #d3bfa7;
    padding: 2rem;
    color: #4a4031;
    font-weight: bold;
    font-size: 1.5rem;
    text-align: center;
  }
  
  @media (min-width: 768px) {
    .auth-container1 {
      width: 10rem;
    }
  }
  
  .auth-container2 {
    background-color: #ece5d0;
    display: flex;
    align-items: center;
    justify-content: center;
   
  }
  
  .auth-container-form {
    max-width: 100rem;
    margin: auto;
    text-align: center;
    padding: 2rem;
    background-color: rgba(80, 123, 113, 0.6);
 /* Azul jade suave */
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    color: #f4f1ea; /* Texto en color claro */
    margin: 0  2.5rem 0 2.5rem; 
  }
  
  .auth-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }
  
  .inputs {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    width: 100%;
  }
  
  label {
    text-align: left;
    font-weight: 600;
    color: #f4f1ea;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #b0a896; /* Color borde tenue */
    border-radius: 6px;
    font-size: 1.5rem;
    background-color: #f7f5e6; /* Fondo suave */
    color: #4a4031; /* Texto oscuro */
    outline: none;
    transition: border-color 0.3s ease;
  }
  
  input::placeholder {
    color: #a59f88; /* Placeholder vintage */
  }
  
  input:focus {
    border-color: #b88b4a; /* Color de foco vintage */
  }
  
  .google-button {
    width: 100%;
    padding: 0.8rem;
    margin-top: 1rem;
    background-color: #b88b4a; /* Café vintage */
    color: #f4f1ea;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background-color 0.3s ease;
  }
  
  .google-button:hover {
    background-color: #8c6336;
  }
  
  .submit-button {
  width: 100%;
  padding: 0.8rem;
  margin-top: 1.5rem;
  background-color: #008080; /* Turquesa vibrante */
  color: #ffffff; /* Blanco para texto */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold; /* Para destacar más */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); /* Sombra para profundidad */
  transition: all 0.3s ease;
}

.submit-button:hover {
  background-color: #00bfbf; /* Turquesa más claro */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.5); /* Incrementa sombra al pasar el mouse */
  transform: scale(1.05); /* Efecto de agrandamiento */
}

.submit-button:active {
  background-color: #006666; /* Turquesa más oscuro al hacer clic */
  transform: scale(0.98); /* Simula presión */
}
  
  .toggle-auth {
    margin-top: 1rem;
    color: #d3bfa7;
    cursor: pointer;
    font-weight: 700;
    font-size: 1.8rem;
    text-decoration: underline;
    transition: color 0.3s ease;
  }
  
  .toggle-auth:hover {
    color: #b88b4a;
  }
  </style>
  
