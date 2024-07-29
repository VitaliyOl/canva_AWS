require("dotenv").config();
const AWS = require("aws-sdk");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY);

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-north-1",
});

const s3 = new AWS.S3();

app.use(bodyParser.json({ limit: "50mb" }));

app.post("/upload", (req, res) => {
  const base64Data = Buffer.from(
    req.body.image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = req.body.image.split(";")[0].split("/")[1];
  const params = {
    Bucket: "imagebucketol", // замініть на ім'я вашого S3 бакета
    Key: `cropped-images/${Date.now().toString()}.${type}`,
    Body: base64Data,
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(data.Location);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
