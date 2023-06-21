const fs = require("fs");
const sharp = require("sharp");
const path = require("path");
const express = require("express");
const multer = require("multer");
const { image_sizes } = require("../config/image_format");
const router = express.Router();
const redis = require("redis");
const rdsFile = redis.createClient({
  db: process.env.temp_file_session_db || 2,
});
const resMainObj = require("../config/resObject");

var count = 1;

const authMiddleware = (req, res, next) => {
  const { url } = req;
  try {
    if (!req.headers.authorization) {
      const resObj = resMainObj();
      resObj.status = 404;
      resObj.error.systems = {
        count: 1,
        errors: [
          {
            domain: "url",
            value: `${url}`,
            message: `Token not found.`,
          },
        ],
      };
      return res.status(404).json(resObj);
    }
    const auth = req.headers.authorization.split(" ")[1];
    //console.log(auth);
    if (!auth) {
      const resObj = resMainObj();
      resObj.status = 401;
      resObj.error.systems = {
        count: 1,
        errors: [
          {
            domain: "url",
            value: `${url}`,
            message: `Unauthorized`,
          },
        ],
      };
      return res.status(401).json(resObj);
    }
    const uniquePartOfToken = auth.split(".").pop();
    req["user"] = {};
    req["user"]["uniquePartOfToken"] = uniquePartOfToken;
    req["user"]["redis_file_key"] = uniquePartOfToken;
    //rdsFile.lrange(req["user"]["redis_file_key"], 0, -1, function(err, vals) {
    //if(vals.length > process.env.numOfMaxFiles) {
    if (false) {
      const resObj = resMainObj();
      resObj.status = 400;
      resObj.error.systems = {
        count: 1,
        errors: [
          {
            domain: "url",
            value: `${url}`,
            message: `Too Many File Requests. Wait for ${
              process.env.numOfMaxSec / 60
            } min`,
          },
        ],
      };
      return res.status(400).json(resObj);
    } else {
      next();
    }
    //});
  } catch (e) {
    const resObj = resMainObj();
    resObj.status = 500;
    resObj.error.systems = {
      count: 1,
      errors: [
        {
          domain: "url",
          value: `${url}`,
          message: `Failed. Please try again!`,
        },
      ],
    };
    return res.status(500).json(resObj);
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uniqueSuffix =
      "" +
      count +
      "-" +
      Date.now("nano") +
      "-" +
      Math.round(Math.random() * 1e9);
    count++;
    const ext = path.extname(file.originalname);
    req["file-folder"] = uniqueSuffix;
    req["file-name"] = "original" + ext;
    req["file-ext"] = ext;
    fs.mkdir(
      process.env.temp_path + "/" + req["file-folder"],
      { recursive: true },
      (err) => {
        if (err) {
          return;
        }
        cb(null, process.env.temp_path);
      }
    );
  },
  filename: function (req, file, cb) {
    cb(null, req["file-folder"] + "/" + req["file-name"]);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    files: 1, // allow up to 1 files per request,
    fieldSize: process.env.sizeOfFileMax ?? 50 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (
      !String(file.originalname)
        .toLowerCase()
        .match(/\.(jpg|jpeg|png|gif|heic|heif|pdf|doc|docx|xlsx|csv)$/)
    ) {
      req["fileValidationError"] =
        "Only image or pdf or doc or excel files are allowed!";
      return callback(null, false);
    }
    callback(null, true);
  },
});
router.post("/upload", authMiddleware, upload.any(), (req, res, next) => {
  const { url } = req;
  if (req["fileValidationError"]) {
    const resObj = resMainObj();
    resObj.status = 400;
    resObj.error.systems = {
      count: 1,
      errors: [
        {
          domain: "url",
          value: `${url}`,
          message: req["fileValidationError"],
        },
      ],
    };

    return res.status(400).json(resObj);
  } else if (!req["file-name"]) {
    const resObj = resMainObj();
    resObj.status = 400;
    resObj.error.systems = {
      count: 1,
      errors: [
        {
          domain: "url",
          value: `${url}`,
          message: "file are missing",
        },
      ],
    };
    return res.status(400).json(resObj);
  }
  const resObj = resMainObj();
  resObj.message = "File successfully uploaded.";
  resObj.payload = {
    fileName: req["file-folder"] + req["file-ext"],
  };
  if (req["file-name"].match(/\.(jpg|jpeg|png)$/)) {
    const fileWritePromises = [];
    for (const size_name of Object.keys(image_sizes)) {
      const w = image_sizes[size_name][0];
      const h = image_sizes[size_name][1];
      /*for(let a = 1; a<=5000; a++){
              const w = Math.floor(Math.random()*100)+10;
              const h = Math.floor(Math.random()*100)+10;*/

      const fileWritePromise = sharp(
        process.env.temp_path +
          "/" +
          req["file-folder"] +
          "/" +
          req["file-name"]
      )
        .resize({
          //fit: sharp.fit.contain,
          fit: "fill",
          height: h,
          width: w,
        })
        .toFile(
          process.env.temp_path +
            "/" +
            req["file-folder"] +
            "/" +
            size_name +
            req["file-ext"]
        );
      fileWritePromises.push(fileWritePromise);
    }
    Promise.all(fileWritePromises).then((values) => {
      return res.status(200).json(resObj);
    });
  } else {
    return res.status(200).json(resObj);
  }
});


//Multi Image Upload 


const storage_multi = multer.diskStorage({
  destination: function (req, file, cb) {
    const uniqueSuffix =
      "" +
      count +
      "-" +
      Date.now("nano") +
      "-" +
      Math.round(Math.random() * 1e9);
    count++;
    const ext = path.extname(file.originalname);
    req["file-folder"] = uniqueSuffix;
    req["file-name"] = "original" + ext;
    req["file-ext"] = ext;
    fs.mkdir(
      process.env.temp_path + "/" + req["file-folder"],
      { recursive: true },
      (err) => {
        if (err) {
          return;
        }
        cb(null, process.env.temp_path);
      }
    );
  },
  filename: function (req, file, cb) {
    cb(null, req["file-folder"] + "/" + req["file-name"]);
  },
});

const uploadMulti = multer({
  storage: storage_multi,
  limits: {
    files: 5, // allow up to 1 files per request,
    fieldSize: process.env.sizeOfFileMax ?? 50 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (
      !String(file.originalname)
        .toLowerCase()
        .match(/\.(jpg|jpeg|png|gif|heic|heif|pdf|doc|docx|xlsx|csv)$/)
    ) {
      req["fileValidationError"] =
        "Only image or pdf or doc or excel files are allowed!";
      return callback(null, false);
    }
    callback(null, true);
  },
});
router.post("/upload-multi", authMiddleware, uploadMulti.any(), (req, res, next) => {
  const { url, files, file } = req;
  if (req["fileValidationError"]) {
    const resObj = resMainObj();
    resObj.status = 400;
    resObj.error.systems = {
      count: 1,
      errors: [
        {
          domain: "url",
          value: `${url}`,
          message: req["fileValidationError"],
        },
      ],
    };
    return res.status(400).json(resObj);
  } else if (!req["file-name"]) {
    const resObj = resMainObj();
    resObj.status = 400;
    resObj.error.systems = {
      count: 1,
      errors: [
        {
          domain: "url",
          value: `${url}`,
          message: "file are missing",
        },
      ],
    };
    return res.status(400).json(resObj);
  }
  const resObj = resMainObj();
  resObj.message = "File successfully uploaded.";
  resObj.payload = {
    fileNames: files?.map((file) =>  file.filename.replace("/original","")),
  };
  if (req["file-name"].match(/\.(jpg|jpeg|png)$/)) {
    const fileWritePromises = [];
    for (const size_name of Object.keys(image_sizes)) {
      const w = image_sizes[size_name][0];
      const h = image_sizes[size_name][1];
      /*for(let a = 1; a<=5000; a++){
              const w = Math.floor(Math.random()*100)+10;
              const h = Math.floor(Math.random()*100)+10;*/

      const fileWritePromise = sharp(
        process.env.temp_path +
          "/" +
          req["file-folder"] +
          "/" +
          req["file-name"]
      )
        .resize({
          //fit: sharp.fit.contain,
          fit: "fill",
          height: h,
          width: w,
        })
        .toFile(
          process.env.temp_path +
            "/" +
            req["file-folder"] +
            "/" +
            size_name +
            req["file-ext"]
        );
      fileWritePromises.push(fileWritePromise);
    }
    Promise.all(fileWritePromises).then((values) => {
      return res.status(200).json(resObj);
    });
  } else {
    return res.status(200).json(resObj);
  }
});


router.get("/test", (req, res, next) => {
  res.status(201).json({});
});

module.exports = router;

