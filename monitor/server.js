const axios = require("axios");
const Totalvoice = require("totalvoice-node");
const client = new Totalvoice("4a16165966b020c5dbe4a8879ebbd637");

const servers = [
  {
    name: "Servidor 1",
    url: "http://localhost:4001",
    developer: {
      name: "Felipinho Morais",
      telephone: "11958034620",
    },
  },
  {
    name: "Servidor 2",
    url: "http://localhost:4002",
    developer: {
      name: "Felipinho Morais",
      telephone: "11958034620",
    },
  },
];

(async function () {
  console.log("Iniciando monitoramento dos servers");
  for (const server of servers) {
    try {
      const res = await axios({
        url: server.url,
        method: "get",
      });
      console.log(`${server.name} está no ar`);
    } catch (error) {
      console.log(`${server.name} está fora do ar`);
    }
  }
  console.log("Finalizando monitoramento dos servers");
})();
