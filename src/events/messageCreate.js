
const config = require('../config/config.json');
module.exports = async (client, message) => {
  if (message.author.bot) return;

  let user = await client.db.user.findUnique({ where: { id: message.author.id } });
  if (!user) user = await client.db.user.create({ data: { id: message.author.id } });

  const xp = Math.floor(Math.random() * (config.xp.max - config.xp.min) + config.xp.min);

  await client.db.user.update({
    where: { id: user.id },
    data: { xp: user.xp + xp }
  });
};
