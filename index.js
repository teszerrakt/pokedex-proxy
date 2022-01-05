const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const getPokemon = async () => {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/`);
    return result.data.results;
  };

  const getPokemonDetail = async (pokemonList) => {
    const result = await Promise.all(
      pokemonList.map((poke) => axios.get(poke.url))
    );
    const data = result.map((poke) => poke.data);

    return data;
  };

  const getPokemonSpecies = async (pokemonDetail) => {
    const result = await Promise.all(
      pokemonDetail.map((poke) => axios.get(poke.species.url))
    );
    const data = result.map((poke) => poke.data);

    return data;
  };

  (async () => {
    const pokemonList = await getPokemon();
    const pokemonDetail = await getPokemonDetail(pokemonList);
    const pokemonSpecies = await getPokemonSpecies(pokemonDetail);

    console.log(pokemonList);

    let final = [];

    for (let i = 0; i < pokemonList.length; i++) {
      let pokeObject = {
        color: pokemonSpecies[i]["color"]["name"],
        name: pokemonList[i]["name"],
        types: pokemonDetail[i]["types"],
        image:
          pokemonDetail[i]["sprites"]["other"]["official-artwork"][
            "front_default"
          ],
      };

      final.push(pokeObject);
    }

    const response = {
      headers: {
        "Content-Type": "application/json",
      },
      body: final,
    };

    res.send(response);
  })();
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
