var path = require("path");
var express = require("express");
var multer  = require('multer');
var fs = require("fs");

var app = express();

app.use(express.static(path.resolve(__dirname, "public")));

app.set("views", path.resolve(__dirname, "views"));

app.get("/", function(req, res) {
  fs.createReadStream('./views/index.html').pipe(res);
});

var upload = multer({ dest: __dirname + '/public/' })
var type = upload.single('wav');

app.post('/a', type, function(req, res) {
  console.log(req.body);
  console.log(req.file);
/*
  fs.writeFile('test.wav', req.files, function(err) {
    console.log('비동기적 파일 쓰기 완료');
  });
*/
  
  res.json({
    done: "done"
  });
});

app.use(function(req, res) {
  res.status(404).render("404");
});

app.listen(3000);