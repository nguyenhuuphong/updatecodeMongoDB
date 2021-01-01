var multer = require('multer');

var express = require("express");
//var db = require('../db');
const shortid = require("shortid");
const app = express();
var router = express.Router();

var controller = require('../controllers/books.controller');

var upload = multer({ dest: 'uploads/' });

//GET
router.get("/", controller.home );

//POST
router.post("/" , controller.apiPost  );

// thêm tên sách
//router.get("/create", controller.create);

//router.post("/create", upload.single('coverUrl'), controller.createPost);
// xóa tên sách
//router.get("/:id/delete",  controller.idDelete );


// cập nhật tên sách
//router.get("/:id/update", controller.idUpdate);

//router.post("/:id/update", controller.idUpdatePost);

module.exports = router;