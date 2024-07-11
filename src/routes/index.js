const express = require('express');
const router = express.Router();
const { getVersion } = require('../controllers/versionController');
const { ping } = require('../controllers/pingController');
const { auth } = require('../middleware/auth');
const userController = require('../controllers/UsersController');
const { login, register } = require('../controllers/authController');
const catalogController = require('../controllers/catalogController');
const { attachmentsControllers } = require('../controllers/attachmentsController');
const detailShopController = require('../controllers/detailshopController');
const detailsUsersController = require('../controllers/detailusersController');
const addressUsersController = require('../controllers/addressUsersController');
const SocialMediaUsersController = require('../controllers/socialmediaController');
const invoiceController = require('../controllers/invoiceController');
const biteshipController = require('../controllers/biteshipController');
const transactionController = require('../controllers/transactionController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const mlProxy = require('../controllers/mlProxyController');

router.get('/version', getVersion);
router.get('/ping', ping);
router.get('/protected', auth, ping);
router.use('/users', userController);
router.post('/register', register);
router.post('/login', login);

router.get('/catalogs', catalogController.getAllCatalogs);
router.get('/catalogs/:id', catalogController.getCatalogByid);
router.post('/catalogs', catalogController.createCatalogs);
router.put('/catalogs/:id', catalogController.updateCatalogs);
router.delete('/catalogs/:id', catalogController.deleteCatalogs);

router.get('/details-users', detailsUsersController.getAllDetailsUsers);
router.get('/details-users/:id', detailsUsersController.getDetailsUserById);
router.post('/details-users', detailsUsersController.createDetailsUser);
router.put('/details-users/:id', detailsUsersController.updateDetailsUser);
router.delete('/details-users/:id', detailsUsersController.deleteDetailsUser);

router.get('/detail-shops', detailShopController.getAllShops);
router.get('/detail-shops/:id', detailShopController.getDetailShopById);
router.post('/detail-shops', detailShopController.createDetailShop);
router.put('/detail-shops/:id', detailShopController.updateDetailShop);
router.delete('/detail-shops/:id', detailShopController.deleteDetailShop);

router.get('/address-users', addressUsersController.getAllAddressUsers);
router.get('/address-users/:id', addressUsersController.getAddressUserById);
router.post('/address-users', addressUsersController.createAddressUser);
router.put('/address-users/:id', addressUsersController.updateAddressUser);
router.delete('/address-users/:id', addressUsersController.deleteAddressUser);

router.get('/social-media', SocialMediaUsersController.getAllSocialMediaUsers);
router.get('/social-media/:id', SocialMediaUsersController.getSocialMediaUserById);
router.post('/social-media', SocialMediaUsersController.createSocialMediaUser);
router.put('/social-media/:id', SocialMediaUsersController.updateSocialMediaUser);
router.delete('/social-media/:id', SocialMediaUsersController.deleteSocialMediaUser);

router.post('/attachments', upload.single('file'), attachmentsControllers);
router.post('/invoices', invoiceController.createInvoice);
router.get('/check_rates/:id', auth, biteshipController.checkRates);
router.post('/create_shipment', auth, biteshipController.createShipment);
router.post('/transactions', auth, transactionController.createTransaction);
router.get('/transactions', auth, transactionController.getAllTransactions);
router.get('/transactions/:id', auth, transactionController.getTransactionDetails);

router.use('/ml', mlProxy);

module.exports = router;
