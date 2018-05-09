var Busboy = require('busboy');
var fs = require('fs');
var fse = require('fs-extra');
var os = require('os');
var path = require('path');
var snowflake = require('node-snowflake').Snowflake;

var isEmpty = function (obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

var ueditor = function (static_url, config = {}, handel) {
  return function (req, res, next) {
    var _respond = respond(static_url, config, handel);
    _respond(req, res, next);
  };
};
var respond = function (static_url, config = {}, callback) {
  if (typeof config === 'function') {
    callback = config
    config = {}
  }
  return function (req, res, next) {
    if (req.query.action === 'config') {
      callback(req, res, next);
      return;
    } else if (req.query.action === 'uploadimage') {
      var busboy = new Busboy({
        headers: req.headers
      });
      busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        req.ueditor = {};
        req.ueditor.fieldname = fieldname;
        req.ueditor.file = file;
        req.ueditor.filename = filename;
        req.ueditor.encoding = encoding;
        req.ueditor.mimetype = mimetype;
        res.ue_up = function (img_url) {
          var tmpdir = path.join(os.tmpdir(), path.basename(filename));
          var name = snowflake.nextId() + path.extname(tmpdir);
          var dest = path.join(static_url, img_url, name);
          var client = {};
          //默认上传到项目目录(config对象为空时) 或者 config.local , config.qn 都为 true 时会同时上传到七牛及项目目录
          if (!config || isEmpty(config) || config.local) {
            var writeStream = fs.createWriteStream(tmpdir);
            file.pipe(writeStream);
            writeStream.on("close", function () {
              fse.move(tmpdir, dest, function (err) {
                if (err) throw err;
                res.json({
                  'url': path.join(img_url, name).replace(/\\/g, '/'),
                  'title': req.body.pictitle,
                  'original': filename,
                  'state': 'SUCCESS'
                });
              });
            })
          }
        };
        callback(req, res, next);
      });
      req.pipe(busboy);
    } else {
      callback(req, res, next);
    }
    return;
  };
};
module.exports = ueditor;