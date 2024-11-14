<script setup>
    import {ref} from 'vue'
    import{auth} from '../firebase.js'
  //import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';
    import { useRouter } from 'vue-router'
    
    import { useAuth } from '@/composables/useAuth.js'
   const isLogin = ref(true)
   const email = ref('')
   const password = ref('')
    const username = ref('')
    const router = useRouter()

    const { login, register, signInWithGoogle} = useAuth()
    
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
    <div class="aunth-container"> 
            <div class="aunth-container1">
                <!-- animacion  -->
                animacion
            </div><!-- cont1 -->

            <div class="aunth-container2">

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

                        <button type="button" class="google-button"  @click="signInWithGoogle" >
                            Iniciar sesión con Google
                        </button>
                    </div>

                    <button type="submit" class="submit-button">
                        {{ isLogin ? "Iniciar Sesión" : "Registrarse" }}
                    </button>
                </form>
                
                <p class="toggle-auth" @click="toggleAuth">
                    {{ isLogin ? "¿Aún no tienes una cuenta? Regístrate" : "¿Ya tienes una cuenta? Inicia sesión" }}
                </p>
            </div><!--  cont form -->

            </div><!-- cont 2 -->



    </div>
   
    
    
    
</template>

<style scoped>
.aunth-container{
    display: flex;
    flex-direction: column;
    background-color: #005e30;
    height: 100vh;
    justify-content: center;
}
@media (min-width: 768px ) {
    .aunth-container{
        flex-direction: row;
        justify-content:space-between;

       
    }
    
}
.aunth-container1{

background-color: #fa5f4a;
}


@media (min-width: 768px ) {
    .aunth-container1{
        width: 10rem;
        
        background-color: #c23321;
        
    }
  
}

.aunth-container2{
background-color: #bbb;

}


@media (min-width: 768px ) {
    .aunth-container2{
        max-height: 100vh;
        display: flex;
        background-color: rgb(255, 0, 212);
        align-items: start;
        justify-content: end;
    }
}
.auth-container-form {
    max-width: 400px;
    margin: auto;
    text-align: center;
    padding: 2rem;
    background-color: #757474; /* Fondo oscuro */
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
    color: #f2f2f2; /* Texto claro para contrastar con fondo oscuro */
}
@media (min-width: 768px ) {
    .auth-container-form{
        min-height: 50vh;
        width: 50vh;
        margin-left: 2rem;
        margin-right: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

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
    gap: 1.5rem;
    width: 100%;
    
}


    


label {
    text-align: left;
    font-weight: 500;
    color: #f2f2f2;
    margin-bottom: 0.5rem;
    font-size: 2.4rem;
}

input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #555; /* Bordes sutiles para el fondo oscuro */
    border-radius: 4px;
    font-size: 1rem;
    background-color: #333; /* Fondo del input oscuro */
    color: #f2f2f2; /* Texto claro */
    outline: none;
    transition: border-color 0.3s ease;
}

@media (min-width: 768px ) {
    input{
        width: 100%;
        min-height: 4rem;
        font-size: 1.8rem;
    }
    
}
input::placeholder {
    color: #bbb; /* Placeholder en color suave */
}

input:focus {
    border-color: #42b983; /* Color de foco */
}

.google-button {
    width: 100%;
    padding: 0.8rem;
    margin-top: 1rem;
    background-color: #db4437;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

.google-button:hover {
    background-color: #8e1302;
}

.submit-button {
    width: 100%;
    padding: 0.8rem;
    margin-top: 1.5rem;
    background-color: #42b983;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #05723d;
}

.toggle-auth {
    margin-top: 1rem;
    color: #5cf34b;
    cursor: pointer;
   font-weight: 700;
    font-size: 1.3rem;
    text-decoration: underline;
    transition: color 0.3s ease;
}

.toggle-auth:hover {
    color: #379a6a;
}
</style>

