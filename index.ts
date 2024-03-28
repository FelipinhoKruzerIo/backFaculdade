import { IAction } from "./models/action-interface";
import Totalvoice from "totalvoice-node";
import express from "express";

const app = express();
app.use(express.json());

const client = new Totalvoice("4a16165966b020c5dbe4a8879ebbd637");

app.post("/notification", (req, res) => {
  const actions: IAction = {
    fireMessage: "TA PEGANDO FOGO BIXO",
    gasMessage:
      "TA VAZANDO GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAS",
    fallMessage: "ME DERRUBARO AKI PO",
  };
  const action: string = req?.body?.action;
  const phone: string = req?.body?.phone;
  if (!actions[action] || !phone) {
    res.status = 400;
    return res.json({
      message: !actions[action]
        ? `Ação inválida, as ações disponíveis são: ${Object.keys(actions)}`
        : "Telefone é obrigatório",
    });
  }

  const message = actions[action];
  const options = {
    velocidade: 2,
    tipo_voz: "br-Vitoria",
  };
  client.tts
    .enviar(phone, message, options)
    .then(() => {
      return res.json({
        message: "A pessoa recebeu a ligação !!",
        status: 200,
      });
    })
    .catch(() => {
      return res.json({
        message: "não foi possível realizar a ligação",
        status: 500,
      });
    });
});

app.listen(3000, () => {
  console.log("Servidor está funcionando");
});
