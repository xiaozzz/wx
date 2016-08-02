var request = require('request');

var AppID = "wx1b09ecfa865e9bb5";
var AppSecret = "9834aceb4c85815049e430838ebab55a";
var access_token = "";

function getAccessToken(){
    var url = "https://api.weixin.qq.com/cgi-bin/token";
    var para = "?grant_type=client_credential" +
        "&appid=" + AppID +
        "&secret=" + AppSecret;
    request.get(url+para,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                console.log(data);
                if (data.access_token){
                    access_token = data.access_token;
                }
            } else {
                console.log(error);
            }
        });
}

function setMenu(){
    var url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token="+access_token;
    var json =  {
        "button":[
            {
                "type":"click",
                "name":"今日歌曲",
                "key":"V1001_TODAY_MUSIC"
            },
            {
                "name":"菜单",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"搜索",
                        "url":"http://www.soso.com/"
                    },
                    {
                        "type":"view",
                        "name":"视频",
                        "url":"http://v.qq.com/"
                    },
                    {
                        "type":"click",
                        "name":"赞一下我们",
                        "key":"V1001_GOOD"
                    }]
            }]
    };
    request.post(url,
        form(json),
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                console.log(data);
                if (data.access_token){
                    access_token = data.access_token;
                }
            } else {
                console.log(error);
            }
        });
}

module.exports.getAccessToken = getAccessToken;
module.exports.setMenu = setMenu;