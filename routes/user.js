/**
 * User Route
 * @author Mohammad Umaid Ansari
 * @version 1.0
 *
 */
const express = require("express");
const routes = express.Router();
const { DASHBOARD,LOGIN , GET_CONVO } = require("../utils/config").ROUTES;
const controller = require("../controllers/user");
routes.get(DASHBOARD,controller.dashboard);
routes.post(LOGIN, controller.facebookLogin);
routes.post(GET_CONVO, controller.getConvo);


module.exports = routes;


