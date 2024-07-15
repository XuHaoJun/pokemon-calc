const fs = require("fs")

// https://beta.pokeapi.co/graphql/console/
function getPokemonData() {
  return fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
query samplePokeAPIquery {
  pokemon_v2_pokemon {
    id
    name
    pokemon_v2_pokemonstats {
      base_stat
      stat_id
    }
    pokemon_v2_pokemonspecy {
      pokemon_v2_pokemonspeciesnames {
        language_id
        name
        id
      }
    }
    pokemon_v2_pokemontypes {
      slot
      id
    }
    pokemon_v2_pokemonabilities {
      is_hidden
      slot
      ability_id
    }
  }
  pokemon_v2_stat {
    id
    name
    pokemon_v2_statnames {
      name
      language_id
      id
    }
  }
  pokemon_v2_language {
    id
    name
  }
  pokemon_v2_type {
    id
    name
    pokemon_v2_typenames {
      name
      language_id
      id
    }
  }
  pokemon_v2_abilityflavortext {
    flavor_text
    id
    language_id
    ability_id
  }
}
    `,
      variables: null,
      operationName: "samplePokeAPIquery",
    }),
  }).then((res) => res.json())
}

getPokemonData().then((x) =>
  fs.writeFileSync("./src/data/pokemon-data.json", JSON.stringify(x, null, 2))
)
