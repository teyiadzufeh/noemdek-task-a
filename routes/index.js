const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const compression = require("compression");
const endpointNotFound = require("../middlewares/404");
const error = require("../middlewares/errors");
const logger = require("../middlewares/logger");

router.use(express.json({ limit: "100mb", extended: true }));
router.use(express.urlencoded({ limit: "100mb", extended: true }));
router.use(morgan('tiny'));
router.use(compression())

router.get('/test', async (req,res) => {
    res.send('Test complete');
})
router.use('/user',require('./userRoutes'));
router.use('/schedule',require('./scheduleRoutes'));
router.use('/customer', require('./customerRoutes'));
router.use('/vehicle', require('./vehicleRoutes'));

router.use(error);
router.use(endpointNotFound)

module.exports = router;