const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const queueController = require('../controllers/queueController');
const ticketController = require('../controllers/ticketController');

const { validateToken } = require('../middleware/middleware');

router.post('/queue-create', validateToken, queueController.addQueueToAdmin);
router.get('/queue-get', validateToken, queueController.getQueueById);
router.delete('/queue-delete', validateToken, queueController.deleteQueueById);
router.post('/call-next-ticket', validateToken, queueController.callNextTicket);
router.post('/get-last-called-ticket', validateToken, queueController.getLastCalledTicket);

router.post('/admin-create', adminController.createAdmin);
router.get('/admin-get-data', validateToken, adminController.getAdminUserData);



// router.post('/ticket/request-otp', ticketController.generateOTP);

router.post('/ticket/:adminId/queue/:queueId/checkPhoneNumberUnique', ticketController.checkPhoneNumberUnique);
router.post('/ticket/:adminId/queue/:queueId/generateOTP', ticketController.generateOTP);
router.post('/ticket/:adminId/queue/:queueId/sendOTPviaSMS', ticketController.sendOTPviaSMS);
router.post('/ticket/:adminId/queue/:queueId/verifyOTP', ticketController.verifyOTP);
router.post('/ticket/:adminId/queue/:queueId/createTicket', ticketController.createTicket);
router.get('/ticket/:adminId/queue/:queueId/ticket/:ticketId/info', ticketController.getTicketInfo);



module.exports = router;