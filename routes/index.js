var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
    var token = "zzzkky";
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var arr = [token, timestamp, nonce];
    arr = arr.sort();
    var content = arr[0] + arr[1] + arr[2];
    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');
    shasum.update(content);
    var d = shasum.digest('hex');
    if (signature == d){
        res.send(echostr);
        res.end();
    } else {
        res.send("fail");
        res.end();
    }

});

module.exports = router;
