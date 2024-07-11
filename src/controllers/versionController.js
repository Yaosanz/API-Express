const getVersion = (_req, res) => {
  res.json({ version: '1.0.0' });
};

module.exports = { getVersion };
