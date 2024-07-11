const XenditAPI = require('../utils/xendit');
const Payments = require('../../models/paymentModels');
const xendit = new XenditAPI(process.env.XENDIT_API_KEY);

const createInvoice = async (req, res) => {
  try {
    const invoice = await xendit.createInvoice({
      external_id: `invoice-123123`,
      payer_email: req.body.email,
      description: 'anjay dari sewain nih',
      amount: req.body.amount,
    });

    const paymentDB = {
      invoice_id: invoice.id,
      status: invoice.status,
    };

    const payment = await Payments.create(paymentDB);
    if (req.is_return) {
      return payment;
    }
    res.status(201).json({
      status: 'success',
      data: {
        payment,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'fail',
      message: error,
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const payment = await Payments.findByPk(req.params.id);

    if (payment) {
      const invoice = await xendit.getInvoiceById(payment.external_id);
      payment.invoice_url = invoice.invoice_url;
      await payment.save();

      res.status(200).json({
        status: 'success',
        data: {
          payment,
        },
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Payment not found',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoiceById,
};
