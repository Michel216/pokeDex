<template>
  <div :style="{ background: fondo }" style="color: aliceblue; height: 100vh; overflow: hidden; position: relative;">
    <div v-if="inicial" class="inicial">
      <img src="./imgPoke.png" alt="">
      <div class="BuscarPokemonInicio" style="  width: 60%; 
  position: absolute; 
  left: 50%; 
  top: 3%; 
  transform: translateX(-50%); 
  color: white; 
  /* font-size: 300%;   */
  background-color: rgba(0, 0, 0, 0.508); margin: auto; align-content: center; border-radius: 10px;">
        <q-input style=""
          filled
          v-model="pokemon"
          @keyup.enter="traer"
          placeholder="Buscar Pokémon"
          clearable
          text-color="white"
        >
          <template v-slot:append>
            <q-icon name="search" @click="traer" />
          </template>
        </q-input>
      </div>
    </div>
    <div v-else>
      <div class="BuscarPokemon">
        <q-input style="width: 30%; position: absolute; left: 3%; top: 3%; color: aliceblue; background-color: rgba(0, 0, 0, 0.158); border-radius: 10px; "
          filled
          v-model="pokemon"
          @keyup.enter="traer"
          placeholder="Buscar Pokémon"
          clearable
          text-color="white"
        >
          <template v-slot:append>
            <q-icon name="search" @click="traer" />
          </template>
        </q-input>
      </div>
      <div class="fondo">
      <div class="id">
        <h2>{{ "#" + idPokemon }}</h2>
    </div>
    </div>
      <div class="informacion">
        <div class="imagen">
          <img :src="imgPokemon" alt="">
        </div>
        <div class="infoPokemon">
          <h1 class="nombrePokemon">{{ nombrePokemon }}</h1>
          <div id="types-container">
            <button
              v-for="(type, index) in types"
              :key="index"
              :style="{ backgroundColor: tipoColor[type] }"
              class="type-button"
            >
              {{ type }}
            </button>
          </div>
          <div class="estadistica">
            <div class="estadistica">
  <div v-for="(stat, index) in stats" :key="index" :class="{'speed-container': stat.stat.name === 'speed', 'other-container': stat.stat.name !== 'speed'}">
    <h4 v-if="stat.stat.name === 'speed'" class="speed-text">speed</h4>
    <h4 v-else-if="stat.stat.name !== 'speed'" class="otro-contenedor">{{ stat.stat.name }}</h4>
    <q-circular-progress
      show-value
      :value="stat.base_stat"
      :max="255"
      size="100px"
      color="secondary"
      track-color="grey-2"
    >
      <span class="valor">{{ stat.base_stat }}</span>
    </q-circular-progress>
  </div>
</div>
</div>
        </div>
      </div>
      <div class="datos">
        <h4 class="data">{{ pesoPokemon }} {{ alturaPokemon }}</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const idPokemon = ref("");
const nombrePokemon = ref("");
const tipoPokemon = ref("");
const imgPokemon = ref("");
const alturaPokemon = ref("");
const pesoPokemon = ref("");
const habilidadPokemon = ref("");
const pokemon = ref("");
const stats = ref([]);
const types = ref([]);
const inicial = ref(true);
const fondo = ref("");

const tipoColor = {
  normal: 'rgb(245, 245, 245)',      // '#F5F5F5'
  fire: 'rgb(255, 69, 0)',           // '#FF4500'
  water: 'rgb(30, 144, 255)',        // '#1E90FF'
  electric: 'rgb(255, 215, 0)',      // '#FFD700'
  grass: 'rgb(50, 205, 50)',         // '#32CD32'
  ice: 'rgb(0, 255, 255)',           // '#00FFFF'
  fighting: 'rgb(139, 0, 0)',        // '#8B0000'
  poison: 'rgb(128, 0, 128)',        // '#800080'
  ground: 'rgb(222, 184, 135)',      // '#DEB887'
  flying: 'rgb(135, 206, 235)',      // '#87CEEB'
  psychic: 'rgb(255, 105, 180)',     // '#FF69B4'
  bug: 'rgb(154, 205, 50)',          // '#9ACD32'
  rock: 'rgb(169, 169, 169)',        // '#A9A9A9'
  ghost: 'rgb(138, 43, 226)',        // '#8A2BE2'
  dragon: 'rgb(0, 0, 139)',          // '#00008B'
  dark: 'rgb(0, 0, 0)',              // '#000000'
  steel: 'rgb(192, 192, 192)',       // '#C0C0C0'
  fairy: 'rgb(255, 182, 193)'        // '#FFB6C1'
};

function getContrastingTextColor(bgColor) {
  const rgb = bgColor.match(/\d+/g).map(Number);
  const luminance = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  return luminance > 0.5 ? 'black' : 'white';
}

const tipoTextoColor = {};
for (const [tipo, color] of Object.entries(tipoColor)) {
  tipoTextoColor[tipo] = getContrastingTextColor(color);
}

async function traer() {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.value.toLowerCase()}`);
    console.log(res);
    idPokemon.value = res.data.id;
    nombrePokemon.value = res.data.species.name;
    tipoPokemon.value = res.data.types.map(typeInfo => typeInfo.type.name).join(', ');
    pesoPokemon.value = 'Peso: ' + res.data.weight / 10 + ' kg - ';
    alturaPokemon.value = 'Altura: ' + res.data.height / 10 + ' m';
    habilidadPokemon.value = res.data.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');
    imgPokemon.value = res.data.sprites.other['official-artwork'].front_default;
    stats.value = res.data.stats;
    types.value = res.data.types.map(typeInfo => typeInfo.type.name);
    inicial.value = false;
    fondo.value = tipoColor[types.value[0]];
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    alert('No se pudo obtener los datos del Pokémon. Por favor, verifica el nombre y vuelve a intentarlo.');
  }
}
</script>

<style>
@font-face {
  font-family: "Soft Compound";
  src: url("https://db.onlinewebfonts.com/t/41962e541b2858e8e11a8eb0d6183e5d.eot");
  src: url("https://db.onlinewebfonts.com/t/41962e541b2858e8e11a8eb0d6183e5d.eot?#iefix") format("embedded-opentype"),
       url("https://db.onlinewebfonts.com/t/41962e541b2858e8e11a8eb0d6183e5d.woff2") format("woff2"),
       url("https://db.onlinewebfonts.com/t/41962e541b2858e8e11a8eb0d6183e5d.woff") format("woff"),
       url("https://db.onlinewebfonts.com/t/41962e541b2858e8e11a8eb0d6183e5d.ttf") format("truetype"),
       url("https://db.onlinewebfonts.com/t/41962e541b2858e8e11a8eb0d6183e5d.svg#Soft Compound") format("svg");
}
@font-face {
    font-family: "Bordello-Shaded";
    src: url("https://db.onlinewebfonts.com/t/46f95fc88d25f757bc1393f53910da86.eot");
    src: url("https://db.onlinewebfonts.com/t/46f95fc88d25f757bc1393f53910da86.eot?#iefix")format("embedded-opentype"),
    url("https://db.onlinewebfonts.com/t/46f95fc88d25f757bc1393f53910da86.woff2")format("woff2"),
    url("https://db.onlinewebfonts.com/t/46f95fc88d25f757bc1393f53910da86.woff")format("woff"),
    url("https://db.onlinewebfonts.com/t/46f95fc88d25f757bc1393f53910da86.ttf")format("truetype"),
    url("https://db.onlinewebfonts.com/t/46f95fc88d25f757bc1393f53910da86.svg#Bordello-Shaded")format("svg");
   color: #fff;
}
*{
  font-family: "Soft Compound";
}
body{
  color: rgb(53, 44, 44);
  font-family: "Soft Compound";
}
.inicial img{

  object-fit: cover;
  background-position: center;
  width: 100%;
  height: 100vh; 
  position: absolute;
  z-index: -1; 
}

.BucarPokemon{
position: absolute;
color: #ffffffdc;
}

.q-field__control {
    color: rgb(3, 115, 139);
    height: 65px;
    border-radius: 10px;
}
.q-field__native, .q-field__input, .q-field__focusable-action, .q-icon {
color: #fff;
}
.fondo {
  background-color: transparent;
  width: 35%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}


.id h2 {
  font-size: 133px;
  margin: 0;
  padding: 0;
  color: rgb(0, 0, 0);
  text-shadow: 0px 0px 5px beige;
  opacity: 0.6;
  margin-top: 110%;
}
.informacion{
display: flex;
}

.imagen img{
position: absolute;
z-index: 3;
top: 13%;
left: 25%;
width: 30%;
}
.infoPokemon{
background-color: #ffffffdc;
height: 100%;
width: 60%;

right: 0;
top: 0;
position: absolute;
border-radius: 80px 0 0  80px;
}

.q-input {
color: #fff;
}

.nombrePokemon{
  margin-top: .90%;
  right: 15%;
  font-size: 550%;
  color: black;
  font-family: "Soft Compound";
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

}

#types-container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  margin-top: -50px;
  right: 15%;
}

.type-button {
  cursor: pointer;
  transition: background 0.3s;
  border: 1px solid black;
  border-radius: 25px;
  font-size: 190%;
  margin: 4px;
  border: none;
  padding: 10px;
  width:auto;
  height: auto;
  text-shadow: 0px 0px 4px beige;
  color:rgb(0, 0, 0);
  font-family: "Soft Compound";
  border: .10px solid rgba(0, 0, 0, 0.705);
}

.estadistica {
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 20%; 
  width: 300px; 
  height: -0px; 
 margin-left: 20%;
 margin-top: 2%;
} 
.speed-text {
  margin: 0;
  color: black;
  text-align: center;
  vertical-align: middle;
  padding-top: 16%;
  padding-bottom: 19%;
}
.otro-contenedor{
  margin: 0;
  color: black;
  text-align: center;
  vertical-align: middle;
}

.speed-container {
  margin-bottom: 30%;
}

.other-container {
  margin-bottom: 30%; 
}


.datos{
  position: absolute;
  width: 60%;

right: 0;
bottom: 0%;
  display: flex;
  justify-content: center; /* Alineación al extremo derecho */
  align-items: center;
  /* text-align: center; */
  /* margin: auto; */
/* text-align: center; */
/* transform: translateX(23%);  */
right: 0;

}
.data{
  position:relative;

color: black;
}
.valor {
    color: rgb(3, 83, 101); 
}

/* @media screen and (max-width: 1400px) {
  .fondo-inicial {
  background-image: url("./imgPoke.png");
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh; 
  position: relative;
  z-index: -1;
}

  .datos{
right: 10%;
}

  
} */
@media screen and (max-width: 1060px) {
  .BuscarPokemon {
  width: 150%;
  position: absolute;
  left: 25%;
  top: 3%;
}
.id h2 {
  display: flex;
  /* justify-content: center; */
  margin: auto;
  top: 15%;

  font-size: 14vw;
  left: 13%;
  /* font-weight: 800; */
  position: absolute;
  /* text-align: center; */
  /* z-index: 1; */

}
  .infoPokemon{
background-color: #ffffffdc;
width: 100%;
height: 100%;

bottom: 0;
margin-top: 38%;
/* margin-bottom: 0%; */
border-radius: 80px 80px 0  0;
}

.imagen img{
position: absolute;
z-index: 3;
top: 12%;
left: 65%;
width: 35%;
}

.nombrePokemon{
  /* margin-top: .90%; */
  margin-left: -5%;
  font-size: 8.3vw;
  /* color: black; */
}
/* #types-container {
  margin-left: 55%;
  margin-top: -35px;
} */

.type-button {
  /* cursor: pointer;
  transition: background 0.3s; */
  /* color: white; */
  /* border-radius: 25px; */
  font-size: 3vw;
  /* margin: 4px; */
  /* border: none;
  padding: 10px; */
  /* width:auto;
  height: auto; */
  
}

.estadistica {
  display: grid; 
 
  grid-template-columns: repeat(3, 1fr); 
  /* gap: 30%;  */
  /* width: 300px;  */
  /* height: -0px;  */
/* margin-left: 10%; */

 /* margin-top: 0%; */
} 
.estadistica h4{
  font-size: 3.5vw;
/* color: black; */
}
/* .q-circular-progress{
font-size: 0px;
} */
.speed-text {
  /* margin: 0;
  color: black;
  text-align: center;
  vertical-align: middle; */
  padding-top: 14%;
  padding-bottom: 16%;
}
.datos{
  /* display: flex;
  gap: 50px; */
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateX(40%);
position: absolute;
/* top: 35%; */
left: 2%;
bottom: -10px;
color: black;

}
.datos h4{
  font-size: 3.5vw;
}
}
@media screen and (max-width: 800px) {

  .infoPokemon{
/* background-color: #ffffffdc;
width: 100%; */
/* height: 66%; */
/* 
bottom: 0; */
margin-top: 311px;
/* margin-bottom: 0%; */
/* border-radius: 80px 80px 0  0; */
}

.imagen img{
position: absolute;
z-index: 3;
top: 12%;
left: 55%;
width: 43%;
}

.nombrePokemon{
  /* margin-top: .90%; */
  margin-left: -12%;
  font-size: 8.6vw;
  /* color: black; */
}
/* #types-container {
  margin-left: 55%;
  margin-top: -35px;
} */

.type-button {
  /* cursor: pointer;
  transition: background 0.3s; */
  /* color: white; */
  /* border-radius: 25px; */
  font-size: 3.6vw;

  /* margin: 4px; */
  /* border: none;
  padding: 10px; */
  /* width:auto;
  height: auto; */
  
}

.estadistica {
  display: grid; 
 
  grid-template-columns: repeat(3, 1fr); 
  margin-left: 10%;
  /* gap: 30%;  */
  /* width: 300px;  */
  /* height: -0px;  */
/* margin-left: 10%; */

 /* margin-top: 0%; */
} 
.estadistica h4{
  font-size: 5vw;
/* color: black; */
}
/* .q-circular-progress{
font-size: 0px;
} */
.speed-text {
  /* margin: 0;
  color: black;
  text-align: center;
  vertical-align: middle; */
  padding-top: 14%;
  padding-bottom: 16%;
}
.speed-container {
  margin-bottom: 0%; /* Ajusta este valor según sea necesario */
}

.other-container {
  margin-bottom: 0%; /* Ajusta este valor según sea necesario */
}
.datos{
  /* display: flex;
  gap: 50px; */
position: absolute;
/* top: 35%; */
left: 2%;
bottom: -10px;
color: black;

}
.datos h4{
  font-size: 5vw;
}
}

@media screen and (max-width: 490px) {
  .infoPokemon{
  margin-top: 65%;
  }
  .imagen img{

top: 15%;
left: 48%;
width: 50vw;
}
.id h2 {
  top: 15%;
  font-size: 14vw;
  left: 13%;
}
.BuscarPokemon {
  width: 200%;
  position: absolute;
  left: 13%;
  top: 3%;
}
.nombrePokemon{
  margin-top: .90%;
  margin-left: -30%;
  font-size: 10vw;
  color: black;
}
.type-button {
  /* cursor: pointer;
  transition: background 0.3s; */
  /* color: white; */
  /* border-radius: 25px; */
  font-size:5.5vw;

  /* margin: 4px; */
  /* border: none;
  padding: 10px; */
  /* width:auto;
  height: auto; */
  
}
.estadistica {
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 5%; 
  width: 300px; 

margin-left: 4%;

 margin-top: 0%;
} 
.estadistica h4{
  font-size: 6.5vw;
color: black;
}
.speed-text {
  /* margin: 0;
  color: black;
  text-align: center;
  vertical-align: middle; */
  padding-top: 18%;
  padding-bottom: 20%;
}

.other-container {
/* Ajusta este valor según sea necesario */
}
.datos h4{
  transform: translateX(-10%);
 
  font-size: 5.3vw;
  
}
}
</style>
