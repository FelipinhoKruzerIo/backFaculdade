const Totalvoice = require("totalvoice-node");

const client = new Totalvoice("4a16165966b020c5dbe4a8879ebbd637");

const teste = (req, res) => {
  return res.json({ message: "opaa" });
};

const bucketUrl = "https://notifications-audios.s3-sa-east-1.amazonaws.com";

const notify = (req, res) => {
  const actions = {
    fireMessage: `${bucketUrl}/ta-pegando-fogo.mp3`,
    gasMessage: `${bucketUrl}/musica-gas.mp3`,
    fallMessage: `${bucketUrl}/me-derrubaro-aqui-o.mp3`,
  };
  const action = req?.body?.action;
  const phone = req?.body?.phone;
  if (!actions[action] || !phone) {
    res.status = 400;
    return res.json({
      message: !actions[action]
        ? `Ação inválida, as ações disponíveis são: ${Object.keys(actions)}`
        : "Telefone é obrigatório",
    });
  }

  const message = actions[action];
  // const options = {
  //   velocidade: 2,
  //   tipo_voz: "br-Vitoria",
  // };
  client.audio
    .enviar(phone, message)
    .then(() => {
      return res.json({
        message: "A pessoa recebeu a ligação !!",
        status: 200,
      });
    })
    .catch((err) => {
      return res.json({
        message: "não foi possível realizar a ligação",
        status: 500,
      });
    });
};

module.exports = {
  notify,
  teste,
};
