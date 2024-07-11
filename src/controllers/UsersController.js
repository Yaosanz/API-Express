const express = require('express');
const router = express.Router();
const DetailsUsers = require('../../models/detailuserModels');
const User = require('../../models/UsersModels');
const AddressUsers = require('../../models/addressUserModels');
const DetailShop = require('../../models/detailshopModels');
const SocialMediaUsers = require('../../models/socialmediaModels');
const bcrypt = require('bcrypt');
const { getPagination, getPagingData, parseQueryParams } = require('../utils/pagination');
const {getDetailUsersById} = require('../utils');
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const size = parseInt(req.query.per_page || 20);
    const queryParams = parseQueryParams(req.query);
    const { limit, offset } = getPagination(page, size);

    const users = await User.findAndCountAll({
      limit,
      offset,
      ...queryParams,
      attributes: { exclude: ['password'] },
      include: [{ model: DetailsUsers }],
    });

    const pagingData = getPagingData(users, page, limit);

    return res.status(200).json(pagingData);
  } catch (error) {
    console.error('Error retrieving users:', error);

    return res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getDetailUsersById(userId);
    if (user) {
      return res.status(200).json({
        message: 'Success Get User',
        results: user,
      });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      await user.destroy();
      res.send('User deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email, detail_users_id } = req.body;
  let results;
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: DetailsUsers }],
    });
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (username && username !== user.username) {
      const existingUsernameUser = await User.findOne({ where: { username } });
      if (existingUsernameUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    if (email && email !== user.email) {
      const existingEmailUser = await User.findOne({ where: { email } });
      if (existingEmailUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (detail_users_id) user.detail_users_id = detail_users_id;

    user.updated_at = new Date();
    await user.save();
    let detail_user = {};

    if (req.body.detail_user) {
      if (!user.detail_user) {
        user.detail_user = await DetailsUsers.create({
          ...req.body.detail_user,
          users_id: user.id,
        });
      } else {
        DetailsUsers.update(req.body.detail_user, {
          where: { id: user.detail_user.id },
        });
        user.detail_user = await DetailsUsers.findByPk(user.detail_user.id);
      }
    }

    res.status(201).json({
      message: 'User updated successfully',
      results: user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id/update-password', async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Password update failed!',
        details: 'Current password is incorrect.',
      });
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: 'Password update failed!',
        details: 'New password must be different from the current password.',
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password update failed!',
        details: 'New password and confirm password do not match.',
      });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password by ID:', error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
