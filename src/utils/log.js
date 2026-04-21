
module.exports = async (guild, channelName, content) => {
  const channel = guild.channels.cache.find(c => c.name === channelName);
  if (channel) channel.send(content).catch(()=>{});
};
