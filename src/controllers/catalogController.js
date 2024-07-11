const Catalog = require('../../models/catalogModels');
const DetailShop = require('../../models/detailshopModels');
const Joi = require('joi');
const { getPagination, getPagingData, parseQueryParams } = require('../utils/pagination');

const getAllCatalogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const size = parseInt(req.query.per_page || 20);
    const queryParams = parseQueryParams(req.query);
    const { limit, offset } = getPagination(page, size);
    const data = await Catalog.findAndCountAll({
      limit,
      offset,
      ...queryParams,
      include: [{ model: DetailShop, as: 'shop' }],
    });

    const catalogs = getPagingData(data, page, limit);
    return res.json(catalogs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCatalogByid = async (req, res) => {
  const catalogById = req.params.id;
  try {
    const catalog = await Catalog.findByPk(catalogById, { include: [{ model: DetailShop, as: 'shop' }] });
    if (!catalog) {
      return res.status(404).json({ error: 'Catalog not found' });
    }
    return res.json(catalog);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createCatalogs = async (req, res) => {
  const { name, description, size, price, status, day_rent, day_maintenance, photo_url, shop_id } = req.body;

  const CatalogSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    size: Joi.string(),
    price: Joi.number().required(),
    status: Joi.string().required(),
    day_rent: Joi.number().required(),
    day_maintenance: Joi.number().required(),
    photo_url: Joi.string(),
    shop_id: Joi.string().required(),
  });

  const { error } = CatalogSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newCatalog = await Catalog.create({
      name,
      description,
      size,
      price,
      status,
      day_rent,
      day_maintenance,
      photo_url,
      shop_id,
    });
    return res.status(201).json(newCatalog);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateCatalogs = async (req, res) => {
  const catalogUpdateId = req.params.id;
  const { name, description, size, price, status, day_rent, day_maintenance, photo_url, shop_id } = req.body;

  try {
    const catalog = await Catalog.findByPk(catalogUpdateId);
    if (!catalog) {
      return res.status(404).json({ error: 'Catalog not found' });
    }

    await Catalog.update(
      {
        name,
        description,
        size,
        price,
        status,
        day_rent,
        day_maintenance,
        photo_url,
        shop_id,
      },
      {
        where: {
          id: catalogUpdateId,
        },
      }
    );

    return res.json({ message: 'Catalog updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteCatalogs = async (req, res) => {
  const catalogDeleteId = req.params.id;
  try {
    const catalog = await Catalog.findByPk(catalogDeleteId);
    if (!catalog) {
      return res.status(404).json({ error: 'Catalog not found' });
    }

    await Catalog.destroy({
      where: {
        id: catalogDeleteId,
      },
    });

    return res.json({ message: 'Catalog deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCatalogs,
  getCatalogByid,
  createCatalogs,
  updateCatalogs,
  deleteCatalogs,
};
