<template>
  <div :style="{ background: fondo }" class="main-container">
    <div v-if="inicial" class="inicial">
      <img src="./imgPoke.png" alt="">
      <div class="BuscarPokemonInicio">
        <q-input style="" filled v-model="pokemon" @keyup.enter="traer" placeholder="Buscar Pokémon" clearable
          text-color="white">
          <template v-slot:append>
            <q-icon name="search" @click="traer" />
          </template>
        </q-input>
      </div>
    </div>
    <div v-else>
      <div class="BuscarPokemon">
        <q-input
          style="width: 30%; position: absolute; left: 3%; top: 3%; color: aliceblue; background-color: rgba(0, 0, 0, 0.158); border-radius: 10px; "
          filled v-model="pokemon" @keyup.enter="traer" placeholder="Buscar Pokémon" clearable text-color="white">
          <template v-slot:append>
            <q-icon name="search" @click="traer" />
          </template>
        </q-input>
      </div>
      <div class="fondo">
        <div class="id" :style="{ color: idColor }">
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
            <button v-for="(type, index) in types" :key="index"
              :style="{ backgroundColor: tipoColor[type], color: tipoTextoColor[type] }" class="type-button">
              {{ type }}
            </button>
          </div>
          <div class="estadistica">
            <div class="habilidades">
              <div v-for="(stat, index) in stats" :key="index"
                :class="{ 'speed-container': stat.stat.name === 'speed', 'other-container': stat.stat.name !== 'speed' }">
                <h4 v-if="stat.stat.name === 'speed'" class="speed-text">speed</h4>
                <h4 v-else-if="stat.stat.name !== 'speed'" class="otro-contenedor">{{ stat.stat.name }}</h4>
                <q-circular-progress show-value :value="stat.base_stat" :max="255" size="100px" color="secondary"
                  track-color="grey-2">
                  <span class="valor">{{ stat.base_stat }}</span>
                </q-circular-progress>
              </div>
            </div>
          </div>
          <div class="datos">
            <h4 class="data">{{ pesoPokemon }} {{ alturaPokemon }}</h4>
          </div>
        </div>
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
const idColor = ref("white")

const tipoColor = {
  normal: 'rgb(245, 245, 245)',
  fire: 'rgb(255, 69, 0)',
  water: 'rgb(30, 144, 255)',
  electric: 'rgb(255, 215, 0)',
  grass: 'rgb(50, 205, 50)',
  ice: 'rgb(0, 255, 255)',
  fighting: 'rgb(139, 0, 0)',
  poison: 'rgb(128, 0, 128)',
  ground: 'rgb(222, 184, 135)',
  flying: 'rgb(135, 206, 235)',
  psychic: 'rgb(255, 105, 180)',
  bug: 'rgb(154, 205, 50)',
  rock: 'rgb(169, 169, 169)',
  ghost: 'rgb(138, 43, 226)',
  dragon: 'rgb(0, 0, 139)',
  dark: 'rgb(0, 0, 0)',
  steel: 'rgb(192, 192, 192)',
  fairy: 'rgb(255, 182, 193)'
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
    idColor.value = getContrastingTextColor(tipoColor[types.value[0]])
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

body {
  font-family: "Soft Compound";
  color: rgb(53, 44, 44);
  margin: 0;
  padding: 0;
}

.main-container {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.inicial img {
  object-fit: cover;
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: -1;
}

.BuscarPokemonInicio {
  width: 60%;
  position: absolute;
  left: 50%;
  top: 3%;
  transform: translateX(-50%);
  color: white;
  background-color: rgba(0, 0, 0, 0.508);
  margin: auto;
  align-content: center;
  border-radius: 10px;
}

.BuscarPokemon {
  position: absolute;
  width: 50%;
  left: 3%;
  top: 3%;
  color: aliceblue;
  background-color: rgba(0, 0, 0, 0.158);
  border-radius: 10px;
}

.q-field__control,
.q-field__native,
.q-field__input,
.q-field__focusable-action,
.q-icon {
  color: #fff;
}

.fondo {
  width: 35%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: transparent;
}

.id h2 {
  font-size: 133px;
  margin: 0;
  padding: 0;
  text-shadow: 0px 0px 5px beige;
  opacity: 0.6;
}

.informacion {
  display: flex;
  position: relative;
  height: 100%;
  width: 100%;
}

.imagen img {
  position: absolute;
  z-index: 3;
  top: 13%;
  left: 25%;
  width: 30%;
}

.infoPokemon {
  background-color: #ffffffdc;
  height: 100%;
  width: 60%;
  right: 0;
  top: 0;
  position: relative;
  border-radius: 80px 0 0 80px;
}

.nombrePokemon {
  margin-top: 0.90%;
  font-size: 550%;
  color: black;
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
}

.type-button {
  cursor: pointer;
  transition: background 0.3s;
  border-radius: 25px;
  font-size: 190%;
  margin: 4px;
  padding: 10px;
  color: rgb(0, 0, 0);
  border: 0.10px solid rgba(0, 0, 0, 0.705);
}

.estadistica {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
  gap: 20%;
  width: 100%;
  height: auto;
  margin-top: 2%;
}

.speed-text,
.otro-contenedor {
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  text-align: center;
}

.speed-container,
.other-container {
  margin-bottom: 30%;
}

.datos {
  position: absolute;
  width: 60%;
  bottom: 0;
  display: flex;
  justify-content: center;
}

.data {
  color: black;
}

.valor {
  color: rgb(3, 83, 101);
}

*/ * {
  font-family: "Soft Compound";
}

body {
  color: rgb(53, 44, 44);
  margin: 0;
  padding: 0;
}

.main-container {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.inicial img {
  object-fit: cover;
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: -1;
}

.BuscarPokemonInicio {
  width: 60%;
  position: absolute;
  left: 50%;
  top: 3%;
  transform: translateX(-50%);
  color: white;
  background-color: rgba(0, 0, 0, 0.508);
  margin: auto;
  align-content: center;
  border-radius: 10px;
}

.BucarPokemon {
  position: absolute;
  width: 30%;
  left: 3%;
  top: 3%;
  color: aliceblue;
  background-color: rgba(0, 0, 0, 0.158);
  border-radius: 10px;
}

.q-field__control {
  color: rgb(3, 115, 139);
  height: 65px;
  border-radius: 10px;
}

.q-field__native,
.q-field__input,
.q-field__focusable-action,
.q-icon {
  color: #fff;
}

.fondo {
  width: 35%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: transparent;
}


.id h2 {
  font-size: 133px;
  margin: 0;
  padding: 0;
  text-shadow: 0px 0px 5px beige;
  opacity: 0.6;
  margin-top: 400px;
}

.informacion {
  display: flex;
  height: 100%;
  width: 100%;
}

.imagen img {
  position: absolute;
  z-index: 3;
  top: 10%;
  left: 20%;
}

.infoPokemon {
  background-color: #ffffffdc;
  height: 100%;
  width: 60%;
  right: 0;
  top: 0;
  position: absolute;
  border-radius: 80px 0 0 80px;
}

.q-input {
  color: #fff;
}

.nombrePokemon {
  position: relative;
  margin-top: 0.90%;
  font-size: 550%;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#types-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: -50px;
}

.type-button {
  cursor: pointer;
  transition: background 0.3s;
  border-radius: 25px;
  font-size: 190%;
  margin: 4px;
  padding: 10px;
  color: rgb(0, 0, 0);
  border: .10px solid rgba(0, 0, 0, 0.705);
}

.estadistica {
  position: relative;
  right: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 0;
  width: 100%;
  height: 30%;
  justify-content: center;
  align-items: center;
  margin-bottom: 220px;
}

.habilidades {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40%;
  margin-left: 58%;
  justify-content: space-between;
  align-items: center;
  padding-bottom: -40px;
}

.estadistica>.habilidades>div {
  margin-bottom: -107%;
}

.speed-container,
.other-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.speed-text,
.otro-contenedor {
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  text-align: center;
  margin-bottom: 10px;
}

.speed-container,
.other-container {
  margin-top: 0;
  margin-bottom: 0%;
}

.speed-text {
  padding-top: 30%;
}

.datos {
  position: relative;
  width: 60%;
  text-align: center;
  margin: auto;
  font-size: 10%;
}

.data {
  color: black;
}

.valor {
  color: rgb(3, 83, 101);
}

@media screen and (max-width: 1060px) {
  .BuscarPokemon {
    width: 190%;
    position: relative;
    left: 16%;
    font-size: 17px;
    top: 3%;
    margin-bottom: 2%;
  }

  .q-field__native,
  .q-field__input,
  .q-field {
    height: 90%;
    font-size: 120%;
  }

  .id h2 {
    display: flex;
    margin-top: 50px;
    top: 10%;
    font-size: 14vw;
    left: 13%;
    position: absolute;
  }

  .infoPokemon {
    background-color: #ffffffdc;
    width: 100%;
    height: auto;
    margin-top: 38%;
    border-radius: 80px 80px 0 0;
    overflow: auto;
    bottom: 0;
  }

  .imagen img {
    position: absolute;
    z-index: 3;
    top: 100px;
    left: 55%;
    width: 45vw;
  }

  .nombrePokemon {
    margin-left: -30%;
    font-size: 9vw;
  }

  .type-button {
    font-size: 4.3vw;
  }

  #types-container {
    margin-left: -30%;
  }

  .habilidades {
    width: 60%;
    justify-content: center;
    text-align: center;
    margin: 0 auto;
  }

  .estadistica {
    display: grid;
    margin-top: 0%;
    grid-template-columns: repeat(3, 1fr);
    width: 60%;
  }

  .estadistica h4 {
    font-size: 5.3vw;
  }

  .estadistica>.habilidades>div {
    margin-bottom: -80%;
  }

  .habilidades {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40%;
    justify-content: space-between;
    align-items: center;
  }

  .datos h4 {
    padding-top: 50px;
    font-size: 5vw;
  }
}

@media screen and (max-width: 800px) {
  .datos {
    left: 0%;
    bottom: -10px;
    color: black;
  }

  .datos h4 {
    font-size: 4vw;
  }

  .infoPokemon {
    font-size: 5.5vw;
  }

  .estadistica {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5%;
    width: 300px;
    margin-left: 4%;
    margin-top: 0%;
  }

  .estadistica h4 {
    font-size: 6.5vw;
    color: black;
  }

  .speed-text {
    padding-top: 18%;
    padding-bottom: 20%;
  }

  .datos h4 {
    font-size: 5.2vw;
  }
}

@media screen and (max-width: 640px) {
  .id h2 {
    display: flex;
    margin-top: 50px;
    top: 10%;
    font-size: 14vw;
    left: 11%;
    position: absolute;
  }

  .infoPokemon {
    background-color: #ffffffdc;
    width: 100%;
    height: auto;
    margin-top: 60%;
    border-radius: 80px 80px 0 0;
    overflow: auto;
    bottom: 0;
  }

  .imagen img {
    position: absolute;
    z-index: 3;
    top: 130px;
    left: 50%;
    width: 52vw;
  }

  .nombrePokemon {
    margin-left: -36%;
    font-size: 11vw;
  }

  .type-button {
    font-size: 5vw;
  }

  #types-container {
    margin-left: -38%;
  }

  .habilidades {
    width: 50%;
    justify-content: center;
    text-align: center;
    margin: 0 auto;
  }

  .estadistica {
    display: grid;
    margin-top: 0%;
    grid-template-columns: repeat(3, 1fr);
    width: 35%;
  }

  .estadistica h4 {
    font-size: 7vw;
  }

  .estadistica>.habilidades>div {
    margin-bottom: -90%;
  }

  .habilidades {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40%;
    justify-content: space-between;
    align-items: center;
  }

  .datos h4 {
    padding-top: 20px;
    font-size: 5.3vw;
  }
}

@media screen and (max-width: 560px) {
  .BuscarPokemon {
    width: 240%;
    position: relative;
    left: 6%;
    top: 3%;
    margin-bottom: 2%;
  }

  .id h2 {
    display: flex;
    margin-top: 65px;
    top: 10%;
    font-size: 14vw;
    left: 11%;
    position: absolute;
  }

  .infoPokemon {
    background-color: #ffffffdc;
    width: 100%;
    height: auto;
    margin-top: 63%;
    border-radius: 80px 80px 0 0;
    overflow: auto;
    bottom: 0;
  }

  .imagen img {
    position: absolute;
    z-index: 3;
    top: 150px;
    left: 50%;
  }

  .type-button {
    font-size: 6.5vw;
  }

  .habilidades {
    width: 50%;
    justify-content: center;
    text-align: center;
  }

  .estadistica {
    display: grid;
    margin-top: 0%;
    grid-template-columns: repeat(2, 1fr);
    width: 60%;
  }

  .estadistica h4 {
    font-size: 7.5vw;
  }

  .estadistica>.habilidades>div {
    margin-bottom: -124%;
  }

  .habilidades {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40%;
    justify-content: space-between;
    align-items: center;
  }

  .datos {
    width: 90%;
    margin: 20px auto;
    text-align: center;
  }

  .datos h4 {
    padding-top: 260px;
    font-size: 7vw;
    margin: 0%;
  }
}
</style>
