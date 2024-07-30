const fs = require("fs")

// https://beta.pokeapi.co/graphql/console/
function getPokemonData() {
  const body = JSON.stringify({
    query: fs.readFileSync("./pokemon-data.gql").toString(),
    variables: null,
    operationName: "samplePokeAPIquery",
  })

  // you can self-host pokeapi graphql endpoint
  // https://github.com/PokeAPI/pokeapi?tab=readme-ov-file#graphql--
  const apiEndpoint = "http://localhost:8080/v1/graphql"

  // const apiEndpoint = "https://beta.pokeapi.co/graphql/v1beta"

  return fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body,
  }).then((res) => res.json())
}

getPokemonData().then((x) => {
  fs.writeFileSync(
    "./public/data/pokemon-data.json",
    JSON.stringify(x, null, 2)
  )
})
