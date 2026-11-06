const express = require("express");
const { getfavorites, addfavorites, deletefavorites } = require("../controllers/favorite.controllers");
const router = express.Router();

router.get('/',getfavorites)
router.post('/',addfavorites)
router.delete('/deletefavorite',deletefavorites)

exports.favoriterouter=router