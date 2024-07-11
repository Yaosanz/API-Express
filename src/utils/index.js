const User = require("../../models/UsersModels");
const DetailsUsers = require("../../models/detailuserModels");
const AddressUsers = require("../../models/addressUserModels");
const DetailShop = require("../../models/detailshopModels");
const SocialMediaUsers = require("../../models/socialmediaModels");
const getDetailUsersById = async (id) => {
    return User.findByPk(id, {
        attributes: { exclude: ['password'] },
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
    });
}

const getDetailUsersByShopId = async (shopId) => {
    return User.findOne({
        include: [
            {
                model: DetailsUsers,
                where: { detail_shop_id: shopId }, // Add a where condition here
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
        attributes: { exclude: ['password'] }
    });
}

module.exports = { getDetailUsersById, getDetailUsersByShopId }