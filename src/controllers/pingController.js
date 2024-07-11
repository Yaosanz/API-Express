const ping = (_req, res) => {
  res.json({ message: 'Ping!' });
};

module.exports = { ping };
