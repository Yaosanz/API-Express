const DetailShop = require('./detailshopModels');
const Catalog = require('./catalogModels');
const DetailsUsers = require('./detailuserModels');
const Users = require('./UsersModels');
const AddressUsers = require('./addressUserModels');
const SocialMediaUsers = require('./socialmediaModels');
const Transaction = require('./transactionModels');
const TransactionItems = require('./transactionitemsModels');

const setupAssociations = () => {
  // Association between DetailShop and Catalog
  DetailShop.hasOne(Catalog, {
    foreignKey: 'shop_id',
    onDelete: 'CASCADE',
  });

  Catalog.belongsTo(DetailShop, {
    foreignKey: 'shop_id',
    as: 'shop',
  });

  // Association between Users and DetailsUsers
  Users.hasOne(DetailsUsers, {
    foreignKey: 'users_id',
  });

  DetailsUsers.belongsTo(Users, {
    foreignKey: 'users_id',
  });

  // Association between DetailsUsers and AddressUsers
  AddressUsers.hasOne(DetailsUsers, {
    foreignKey: 'address_user_id',
    onDelete: 'CASCADE',
  });

  DetailsUsers.belongsTo(AddressUsers, {
    foreignKey: 'address_user_id',
    as: 'address_user',
  });

  // Association between DetailsUsers and DetailShop
  DetailShop.hasOne(DetailsUsers, {
    foreignKey: 'detail_shop_id',
    onDelete: 'CASCADE',
  });

  DetailsUsers.belongsTo(DetailShop, {
    foreignKey: 'detail_shop_id',
    as: 'detail_shop',
  });

  // Association between SocialMediaUsers and DetailsUsers
  SocialMediaUsers.hasOne(DetailsUsers, {
    foreignKey: 'social_media_id',
    onDelete: 'CASCADE',
  });

  DetailsUsers.belongsTo(SocialMediaUsers, {
    foreignKey: 'social_media_id',
    as: 'social_media_user',
  });

  // Association between Users and Transactions
  Users.hasMany(Transaction, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });

  Transaction.belongsTo(Users, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // Association between DetailShop and Transactions
  DetailShop.hasMany(Transaction, {
    foreignKey: 'shop_id',
    onDelete: 'CASCADE',
  });

  Transaction.belongsTo(DetailShop, {
    foreignKey: 'shop_id',
    as: 'shop',
  });

  Transaction.belongsTo(Catalog, {
    foreignKey: 'transaction_item',
  });

  Transaction.belongsTo(TransactionItems, {
    foreignKey: 'transaction_item',
    as: 'transactionItem',
  });
};
module.exports = setupAssociations;
