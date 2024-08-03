const fs = require("fs")
const { exec } = require("child_process")

async function main() {
  // you can self-host pokeapi graphql endpoint
  // https://github.com/PokeAPI/pokeapi?tab=readme-ov-file#graphql--
  // const apiEndpoint = "http://localhost:8080/v1/graphql"

  const apiEndpoint = "https://beta.pokeapi.co/graphql/v1beta"

  const pokemonData = await getPokemonData(apiEndpoint)
  fs.writeFileSync(
    "./public/data/pokemon-data.json",
    JSON.stringify(pokemonData, null, 2)
  )

  getAndSavePokemonSchema(apiEndpoint, "pokeapi-schema.gql")
  // TODO
  // automate transforms graphql schema and my query to typescript
  // https://transform.tools/graphql-to-typescript
}

// https://beta.pokeapi.co/graphql/console/
async function getPokemonData(apiEndpoint) {
  const body = JSON.stringify({
    query: fs.readFileSync("./pokemon-data.gql").toString(),
    variables: null,
    operationName: "samplePokeAPIquery",
  })
  return fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body,
  }).then((res) => res.json())
}

async function getAndSavePokemonSchema(apiEndpoint, filename) {
  const command = `npx gq ${apiEndpoint} --introspect > ${filename}`
  exec(command)
}

main()
