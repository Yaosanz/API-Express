const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../../models/UsersModels');
const DetailsUsers = require('../../models/detailuserModels');
const SocialMediaUsers = require('../../models/socialmediaModels');
const AddressUsers = require('../../models/addressUserModels');
const DetailShop = require('../../models/detailshopModels');

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '99999998898999898h',
  });
};

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().min(3).max(20).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Register Failed!',
        details: error.details[0].message,
      });
    }

    const { email, password, username } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Register Failed!', details: 'Email already exists' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({
        message: 'Register Failed!',
        details: 'Username already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    const newSocialMediaUser = await SocialMediaUsers.create();
    const newAddressUser = await AddressUsers.create();
    const newDetailShop = await DetailShop.create();

    // create detail user
    const newDetailsUser = await DetailsUsers.create({
      users_id: newUser.id,
      social_media_id: newSocialMediaUser.id,
      address_user_id: newAddressUser.id,
      detail_shop_id: newDetailShop.id,
    });

    const token = generateAccessToken(newUser);

    res.status(201).json({
      message: 'Register Success!',
      results: {
        id: newUser.id,
        token,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Register Failed!', details: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Login Failed!',
        details: error.details[0].message,
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne(
      { where: { email } },
      {
        include: [
          {
            model: DetailsUsers,
            include: [
              {
                model: AddressUsers,
                as: 'address_user',
              },
              {
                model: DetailShop,
                as: 'detail_shop',
              },
              {
                model: SocialMediaUsers,
                as: 'social_media_user',
              },
            ],
          },
        ],
      }
    );

    if (!user.DetailsUser) {
      const newSocialMediaUser = await SocialMediaUsers.create();
      const newAddressUser = await AddressUsers.create();
      const newDetailShop = await DetailShop.create();

      // create detail user
      const newDetailsUser = await DetailsUsers.create({
        users_id: user.id,
        social_media_id: newSocialMediaUser.id,
        address_user_id: newAddressUser.id,
        detail_shop_id: newDetailShop.id,
      });
    } else {
      if (!user.DetailsUser.social_media_id) {
        const newSocialMediaUser = await SocialMediaUsers.create();
        const newDetailsUser = await DetailsUsers.update(
          {
            social_media_id: newSocialMediaUser.id,
          },
          {
            where: {
              id: user.DetailsUser.id,
            },
          }
        );
      }
      if (!user.DetailsUser.address_user_id) {
        const newAddressUser = await AddressUsers.create();
        const newDetailsUser = await DetailsUsers.update(
          {
            address_user_id: newAddressUser.id,
          },
          {
            where: {
              id: user.DetailsUser.id,
            },
          }
        );
      }
      if (!user.DetailsUser.detail_shop_id) {
        const newDetailShop = await DetailShop.create();
        const newDetailsUser = await DetailsUsers.update(
          {
            detail_shop_id: newDetailShop.id,
          },
          {
            where: {
              id: user.DetailsUser.id,
            },
          }
        );
      }
    }

    if (!user) {
      return res.status(400).json({
        message: 'Login Failed!',
        details: 'Email not found',
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: 'Login Failed!',
        details: 'Password is incorrect',
      });
    }
    const token = generateAccessToken(user);

    res.status(200).json({
      message: 'Login Success!',
      results: {
        id: user.id,
        token,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login Failed!', details: error.message });
  }
};

module.exports = {
  register,
  login,
};
