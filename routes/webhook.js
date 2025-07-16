const express = require("express");
const router = express.Router();
const getchat = require("../webhook/getchat");

router.post("/getchat", (req, res) => {
  getchat(req, res);
});

module.exports = router;
