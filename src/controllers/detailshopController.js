const DetailShop = require('../../models/detailshopModels');
const Joi = require('joi');
const { getPagination, getPagingData } = require('../utils/pagination');

const getAllShops = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const size = parseInt(req.query.per_page || 20);

    const { limit, offset } = getPagination(page, size);
    const data = await DetailShop.findAndCountAll({
      limit,
      offset,
      where: {},
    });

    const detailShops = getPagingData(data, page, limit);
    return res.json(detailShops);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getDetailShopById = async (req, res) => {
  const detailShopId = req.params.id;
  try {
    const detailShop = await DetailShop.findByPk(detailShopId);
    if (!detailShop) {
      return res.status(404).json({ error: 'Detail Shop not found' });
    }
    return res.json(detailShop);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createDetailShop = async (req, res) => {
  const { name, username } = req.body;

  const DetailShopSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
  });

  const { error } = DetailShopSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newDetailShop = await DetailShop.create({
      name,
      username,
    });
    return res.status(201).json(newDetailShop);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateDetailShop = async (req, res) => {
  const detailShopUpdateId = req.params.id;
  const { name, username } = req.body;

  try {
    const detailShop = await DetailShop.findByPk(detailShopUpdateId);
    if (!detailShop) {
      return res.status(404).json({ error: 'Detail Shop not found' });
    }

    await DetailShop.update(
      {
        name,
        username,
      },
      {
        where: {
          id: detailShopUpdateId,
        },
      }
    );

    return res.json({ message: 'Detail Shop updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteDetailShop = async (req, res) => {
  const detailShopDeleteId = req.params.id;
  try {
    const detailShop = await DetailShop.findByPk(detailShopDeleteId);
    if (!detailShop) {
      return res.status(404).json({ error: 'Detail Shop not found' });
    }

    await DetailShop.destroy({
      where: {
        id: detailShopDeleteId,
      },
    });

    return res.json({ message: 'Detail Shop deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllShops,
  getDetailShopById,
  createDetailShop,
  updateDetailShop,
  deleteDetailShop,
};
