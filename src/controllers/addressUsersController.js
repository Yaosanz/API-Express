const AddressUsers = require('../../models/addressUserModels');
const Joi = require('joi');
const { getPagination, getPagingData, parseQueryParams } = require('../utils/pagination');

const getAllAddressUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const size = parseInt(req.query.per_page || 20);
    const queryParams = parseQueryParams(req.query);
    const { limit, offset } = getPagination(page, size);

    const data = await AddressUsers.findAndCountAll({
      limit,
      offset,
      ...queryParams,
    });

    const pagingData = getPagingData(data, page, limit);

    return res.status(200).json({
      message: 'Success Get All Address Users',
      results: data.rows,
      paging: pagingData,
    });
  } catch (error) {
    console.error('Error retrieving Address Users:', error);
    return res.status(500).send('Internal Server Error');
  }
};

const getAddressUserById = async (req, res) => {
  const addressUserId = req.params.id;
  try {
    const addressUser = await AddressUsers.findByPk(addressUserId);
    if (!addressUser) {
      return res.status(404).json({ message: 'Address User not found' });
    }
    return res.status(200).json({
      message: 'Success Get Address User',
      results: addressUser,
    });
  } catch (error) {
    console.error('Error retrieving Address User:', error);
    return res.status(500).send('Internal Server Error');
  }
};

const createAddressUser = async (req, res) => {
  const addressUserSchema = Joi.object({
    recipient_name: Joi.string(),
    full_address: Joi.string(),
    number_phone: Joi.string(),
    latitude: Joi.string(),
    longitude: Joi.string(),
  });

  const { error } = addressUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { recipient_name, full_address, number_phone, latitude, longitude } = req.body;
    const newAddressUser = await AddressUsers.create({
      recipient_name,
      full_address,
      number_phone,
      latitude,
      longitude,
    });

    return res.status(201).json({
      message: 'Address User created successfully',
      results: newAddressUser,
    });
  } catch (error) {
    console.error('Error creating Address User:', error);
    return res.status(500).send('Internal Server Error');
  }
};

const updateAddressUser = async (req, res) => {
  try {
    const addressUserId = req.params.id;
    const { recipient_name, full_address, number_phone, latitude, longitude } = req.body;

    const addressUserSchema = Joi.object({
      recipient_name: Joi.string().required(),
      full_address: Joi.string().required(),
      number_phone: Joi.string().required(),
      latitude: Joi.string(),
      longitude: Joi.string(),
    });

    const { error } = addressUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const addressUser = await AddressUsers.findByPk(addressUserId);
    if (!addressUser) {
      return res.status(404).json({ message: 'Address User not found' });
    }

    const oldData = { ...addressUser.get() };

    addressUser.recipient_name = recipient_name;
    addressUser.full_address = full_address;
    addressUser.number_phone = number_phone;
    addressUser.latitude = latitude;
    addressUser.longitude = longitude;

    await addressUser.save();

    const updatedAddressUser = await AddressUsers.findByPk(addressUserId);

    return res.status(200).json({
      message: 'Address User updated successfully',
      changes: {
        oldData: oldData,
        newData: {
          recipient_name: updatedAddressUser.recipient_name,
          full_address: updatedAddressUser.full_address,
          number_phone: updatedAddressUser.number_phone,
          latitude: updatedAddressUser.latitude,
          longitude: updatedAddressUser.longitude,
        },
      },
    });
  } catch (error) {
    console.error('Error updating Address User:', error);
    return res.status(500).send('Internal Server Error');
  }
};

const deleteAddressUser = async (req, res) => {
  const addressUserId = req.params.id;
  try {
    const addressUser = await AddressUsers.findByPk(addressUserId);
    if (!addressUser) {
      return res.status(404).json({ message: 'Address User not found' });
    }

    await addressUser.destroy();

    return res.status(200).json({ message: 'Address User deleted successfully' });
  } catch (error) {
    console.error('Error deleting Address User:', error);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  getAllAddressUsers,
  getAddressUserById,
  createAddressUser,
  updateAddressUser,
  deleteAddressUser,
};
