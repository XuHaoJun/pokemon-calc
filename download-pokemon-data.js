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
  pokemon_v2_pokemon(order_by: {id: asc}) {
    id
    order
    name
    pokemon_v2_pokemonstats(order_by: {stat_id: asc}) {
      base_stat
      stat_id
    }
    pokemon_v2_pokemonspecy {
      pokemon_v2_pokemonspeciesnames(order_by: {language_id: asc}) {
        id
        language_id
        name
      }
    }
    pokemon_v2_pokemontypes(order_by: {type_id: asc}) {
      id
      slot
      type_id
    }
    pokemon_v2_pokemonabilities(order_by: {ability_id: asc}) {
      is_hidden
      slot
      ability_id
    }
  }
  pokemon_v2_stat(order_by: {id: asc}) {
    id
    name
    pokemon_v2_statnames(order_by: {language_id: asc}) {
      id
      name
      language_id
    }
  }
  pokemon_v2_language(order_by: {id: asc}) {
    id
    name
  }
  pokemon_v2_type(order_by: {id: asc}) {
    id
    name
    pokemon_v2_typenames(order_by: {language_id: asc}) {
      id
      name
      language_id
    }
  }
  pokemon_v2_abilityflavortext(order_by: {ability_id: asc, id: asc}) {
    id
    flavor_text
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
  fs.writeFileSync(
    "./public/data/pokemon-data.json",
    JSON.stringify(x, null, 2)
  )
)
