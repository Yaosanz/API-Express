const SocialMediaUsers = require('../../models/socialmediaModels');
const Joi = require('joi');
const { getPagination, getPagingData } = require('../utils/pagination');

const formatSocialMediaUser = (socialMediaUser) => ({
  id: socialMediaUser.id,
  tiktok_username: socialMediaUser.tiktok_username,
  instagram_username: socialMediaUser.instagram_username,
  facebook_username: socialMediaUser.facebook_username,
});

const validateSocialMediaUserInput = async (socialMediaUser) => {
  const schema = Joi.object({
    tiktok_username: Joi.string().required(),
    instagram_username: Joi.string().required(),
    facebook_username: Joi.string().required(),
  });

  return schema.validateAsync(socialMediaUser);
};

const sendResponse = (res, statusCode, message, results = null) => {
  res.status(statusCode).json({ message, results });
};

const getAllSocialMediaUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const size = parseInt(req.query.per_page || 20);

    const { limit, offset } = getPagination(page, size);
    const data = await SocialMediaUsers.findAndCountAll({
      limit,
      offset,
      where: {},
    });

    const formattedSocialMediaUsers = data.rows.map(formatSocialMediaUser);

    const pagingData = getPagingData(formattedSocialMediaUsers, page, limit);

    sendResponse(res, 200, 'Success Get All Social Media Users', { results: formattedSocialMediaUsers, paging: pagingData });
  } catch (error) {
    console.error('Error retrieving Social Media Users:', error);
    sendResponse(res, 500, 'Internal Server Error');
  }
};

const getSocialMediaUserById = async (req, res) => {
  const socialMediaUserId = req.params.id;
  try {
    const socialMediaUser = await SocialMediaUsers.findByPk(socialMediaUserId);
    if (socialMediaUser) {
      sendResponse(res, 200, 'Success Get Social Media User', { results: formatSocialMediaUser(socialMediaUser) });
    } else {
      sendResponse(res, 404, 'Social Media User not found');
    }
  } catch (error) {
    console.error('Error retrieving Social Media User:', error);
    sendResponse(res, 500, 'Internal Server Error');
  }
};

const createSocialMediaUser = async (req, res) => {
  try {
    await validateSocialMediaUserInput(req.body);
    const { tiktok_username, instagram_username, facebook_username } = req.body;
    const newSocialMediaUser = await SocialMediaUsers.create({
      tiktok_username,
      instagram_username,
      facebook_username,
    });

    sendResponse(res, 201, 'Social Media User created successfully', { results: formatSocialMediaUser(newSocialMediaUser) });
  } catch (error) {
    console.error('Error creating Social Media User:', error);

    let errorMessage = 'Bad Request';
    if (error.details) {
      errorMessage = error.details[0].message;
    }

    sendResponse(res, 400, errorMessage);
  }
};

const updateSocialMediaUser = async (req, res) => {
  try {
    await validateSocialMediaUserInput(req.body);

    const socialMediaUserId = req.params.id;
    const { tiktok_username, instagram_username, facebook_username } = req.body;

    const socialMediaUser = await SocialMediaUsers.findByPk(socialMediaUserId);
    if (!socialMediaUser) {
      sendResponse(res, 404, 'Social Media User not found');
    } else {
      socialMediaUser.tiktok_username = tiktok_username;
      socialMediaUser.instagram_username = instagram_username;
      socialMediaUser.facebook_username = facebook_username;

      await socialMediaUser.save();

      sendResponse(res, 200, 'Social Media User updated successfully', { results: formatSocialMediaUser(socialMediaUser) });
    }
  } catch (error) {
    console.error('Error updating Social Media User:', error);
    sendResponse(res, 400, error.details ? error.details[0].message : 'Bad Request');
  }
};

const deleteSocialMediaUser = async (req, res) => {
  const socialMediaUserId = req.params.id;
  try {
    const socialMediaUser = await SocialMediaUsers.findByPk(socialMediaUserId);
    if (!socialMediaUser) {
      sendResponse(res, 404, 'Social Media User not found');
    } else {
      const deletedUserDetails = formatSocialMediaUser(socialMediaUser); // Store details before deletion

      await socialMediaUser.destroy();
      sendResponse(res, 200, 'Social Media User deleted successfully', { deletedUser: deletedUserDetails });
    }
  } catch (error) {
    console.error('Error deleting Social Media User:', error);
    sendResponse(res, 500, 'Internal Server Error');
  }
};

module.exports = {
  getAllSocialMediaUsers,
  getSocialMediaUserById,
  createSocialMediaUser,
  updateSocialMediaUser,
  deleteSocialMediaUser,
};
