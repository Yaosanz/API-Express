const DetailsUsers = require('../../models/detailuserModels');
const Joi = require('joi');
const { getPagination, getPagingData } = require('../utils/pagination');

const formatDetailsUser = (detailsUser) => ({
  id: detailsUser.id,
  users_id: detailsUser.users_id,
  full_name: detailsUser.full_name,
  number_phone: detailsUser.number_phone,
  social_media_id: detailsUser.social_media_id,
  address_user_id: detailsUser.address_user_id,
  detail_shop_id: detailsUser.detail_shop_id,
  photo_url: detailsUser.photo_url,
});

const validateDetailsUser = async (detailsUser) => {
  const schema = Joi.object({
    users_id: Joi.string().uuid().required(),
    full_name: Joi.string().required(),
    number_phone: Joi.string().allow(null),
    social_media_id: Joi.string().uuid().allow(null),
    address_user_id: Joi.string().uuid().allow(null),
    detail_shop_id: Joi.string().uuid().allow(null),
    photo_url: Joi.string().allow(null),
  });

  await schema.validateAsync(detailsUser);
};

const sendResponse = (res, statusCode, message, results = null) => {
  res.status(statusCode).json({ message, results });
};

const getAllDetailsUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const size = parseInt(req.query.per_page || 20);

    const { limit, offset } = getPagination(page, size);
    const data = await DetailsUsers.findAndCountAll({
      limit,
      offset,
      where: {},
    });

    const formattedDetailsUsers = data.rows.map(formatDetailsUser);

    const pagingData = getPagingData(formattedDetailsUsers, page, limit);

    sendResponse(res, 200, 'Success Get All Users', { results: formattedDetailsUsers, paging: pagingData });
  } catch (error) {
    console.error('Error retrieving Detail Users:', error);
    sendResponse(res, 500, 'Internal Server Error');
  }
};

const getDetailsUserById = async (req, res) => {
  const detailsUserId = req.params.id;
  try {
    const detailsUser = await DetailsUsers.findByPk(detailsUserId);
    if (detailsUser) {
      sendResponse(res, 200, 'Success Get Details User', { results: formatDetailsUser(detailsUser) });
    } else {
      sendResponse(res, 404, 'Details User not found');
    }
  } catch (error) {
    console.error('Error retrieving Detail User:', error);
    sendResponse(res, 500, 'Internal Server Error');
  }
};

const createDetailsUser = async (req, res) => {
  try {
    await validateDetailsUser(req.body);

    const { users_id, full_name, number_phone, social_media_id, address_user_id, detail_shop_id, photo_url } = req.body;
    const existingDetailsUser = await DetailsUsers.findOne({ where: { full_name } });

    if (existingDetailsUser) {
      sendResponse(res, 400, 'Full Name is already taken');
    }

    const newDetailsUser = await DetailsUsers.create({
      users_id,
      full_name,
      number_phone,
      social_media_id,
      address_user_id,
      detail_shop_id,
      photo_url,
    });

    sendResponse(res, 201, 'Details User created successfully', { results: formatDetailsUser(newDetailsUser) });
  } catch (error) {
    console.error('Error creating Detail User:', error);
    sendResponse(res, 400, error.details ? error.details[0].message : 'Bad Request');
  }
};

const updateDetailsUser = async (req, res) => {
  try {
    await validateDetailsUser(req.body);

    const detailsUserId = req.params.id;
    const { full_name, number_phone, social_media_id, address_user_id, detail_shop_id, photo_url } = req.body;

    const detailsUser = await DetailsUsers.findByPk(detailsUserId);
    if (!detailsUser) {
      sendResponse(res, 404, 'Details User not found');
    }

    if (full_name !== detailsUser.full_name) {
      const isFullNameTaken = await DetailsUsers.findOne({
        where: { full_name },
      });

      if (isFullNameTaken) {
        sendResponse(res, 400, 'Full Name is already taken');
      }
    }

    detailsUser.full_name = full_name;
    detailsUser.number_phone = number_phone;
    detailsUser.social_media_id = social_media_id;
    detailsUser.address_user_id = address_user_id;
    detailsUser.detail_shop_id = detail_shop_id;
    detailsUser.photo_url = photo_url;

    await detailsUser.save();

    sendResponse(res, 200, 'Details User updated successfully', { results: formatDetailsUser(detailsUser) });
  } catch (error) {
    console.error('Error updating Detail User:', error);
    if (error.name === 'SequelizeUniqueConstraintError' && error.fields.includes('full_name')) {
      sendResponse(res, 400, 'Full Name is already taken');
    } else {
      sendResponse(res, 400, error.details ? error.details[0].message : 'Bad Request');
    }
  }
};

const deleteDetailsUser = async (req, res) => {
  const detailsUserId = req.params.id;
  try {
    const detailsUser = await DetailsUsers.findByPk(detailsUserId);
    if (!detailsUser) {
      sendResponse(res, 404, 'Details User not found');
    }

    await detailsUser.destroy();

    sendResponse(res, 200, 'Details User deleted successfully');
  } catch (error) {
    console.error('Error deleting Detail User:', error);
    sendResponse(res, 500, 'Internal Server Error');
  }
};

module.exports = {
  getAllDetailsUsers,
  getDetailsUserById,
  createDetailsUser,
  updateDetailsUser,
  deleteDetailsUser,
};
