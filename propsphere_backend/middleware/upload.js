const Busboy = require("busboy");

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function uploadImages(req, res, next) {
  if (!req.is("multipart/form-data")) {
    return res.status(400).send({ msg: "Expected a multipart form upload." });
  }

  let parser;
  try {
    parser = Busboy({
      headers: req.headers,
      limits: { files: MAX_FILES, fileSize: MAX_FILE_SIZE },
    });
  } catch {
    return res.status(400).send({ msg: "Invalid image upload." });
  }

  req.body = {};
  req.files = [];
  let uploadError;

  parser.on("field", (name, value) => {
    req.body[name] = value;
  });

  parser.on("file", (fieldName, file, info) => {
    if (fieldName !== "images") {
      file.resume();
      return;
    }
    if (!ALLOWED_TYPES.has(info.mimeType)) {
      uploadError = new Error("Only JPG, PNG, and WEBP images are allowed.");
      file.resume();
      return;
    }

    const chunks = [];
    file.on("data", (chunk) => chunks.push(chunk));
    file.on("limit", () => {
      uploadError = new Error("Each image must be 5 MB or smaller.");
    });
    file.on("end", () => {
      if (!file.truncated) {
        req.files.push({
          fieldname: fieldName,
          originalname: info.filename,
          mimetype: info.mimeType,
          buffer: Buffer.concat(chunks),
        });
      }
    });
  });

  parser.on("filesLimit", () => {
    uploadError = new Error("You can upload up to 10 images.");
  });
  parser.on("error", (error) => {
    uploadError = error;
  });
  parser.on("close", () => {
    if (uploadError) return res.status(400).send({ msg: uploadError.message });
    next();
  });

  req.pipe(parser);
}

module.exports = uploadImages;
