const Transaction = require('../../models/transactionModels');
const User = require('../../models/UsersModels');
const Catalog = require('../../models/catalogModels');
const DetailShop = require('../../models/detailshopModels');
const TransactionItems = require('../../models/transactionitemsModels');
const Shipment = require('../../models/shipmentModels');
const { createInvoice } = require('../controllers/invoiceController');

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: User, as: 'user' },
        { model: DetailShop, as: 'shop' },
        { model: TransactionItems, as: 'transactionItem' },
      ],
    });

    res.status(200).json({
      status: 'success',
      data: {
        transactions,
      },
    });
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

const getTransactionDetails = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const transactionDetails = await Transaction.findByPk(transactionId, {
      include: [
        { model: User, as: 'user' },
        { model: DetailShop, as: 'shop' },
        { model: TransactionItems, as: 'transactionItem' },
      ],
    });

    if (!transactionDetails) {
      return res.status(404).json({
        status: 'fail',
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        transaction: transactionDetails,
      },
    });
  } catch (error) {
    console.error('Error retrieving transaction details:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

const createTransaction = async (req, res) => {
  try {
    const reqInvoice = {
      body: {
        email: req.user.email,
        description: req.body.description,
        amount: req.body.amount,
      },
    };

    reqInvoice.is_return = true;
    const invoiceTransaction = await createInvoice(reqInvoice, res);
    const catalog = await Catalog.findByPk(req.body.catalog.id, { include: [{ model: DetailShop, as: 'shop' }] });
    const shipment = await Shipment.create();
    const dbTrans = {
      user_id: req.user.id,
      payment_id: invoiceTransaction.id,
      shop_id: catalog.shop.id,
      start_rent_date: req.body.start_rent_date,
      end_rent_date: req.body.end_rent_date,
      transaction_item: catalog.id,
      shipment_id: shipment.id,
    };

    const newTransaction = await Transaction.create(dbTrans);

    res.status(201).json({
      status: 'success',
      data: {
        transaction: newTransaction,
      },
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionDetails,
  createTransaction,
};
