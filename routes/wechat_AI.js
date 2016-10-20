var wechat_AI = function (req, res, next) {
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    var createTime = message.CreateTime;
    var msgType = message.MsgType;
    if (msgType == 'text') {
        var opt = message.Content.slice(0, 3);
        var content = message.Content.split(' ')[1];
        res.reply("请访问我的博客: http://zzzkky.cn 关注我的信息！");

    } else if (msgType == 'event') {
        switch (message.EventKey) {
            case '01_00': // 关于我
                res.reply("本人赵晓辉，英文ID: zzzkky，性别♂\n" +
                    "目前在上海交通大学修读软件工程硕士\n微信号: zzzkky_zxh\n" +
                    "QQ号: 727318143\n" +
                    "邮箱: philip.20050132@163.com\n" +
                    "个人博客地址: zzzkky.cn");
                break;
            case '00_00': // 我的博客
                res.reply([
                    {
                        title: 'Blog',
                        description: 'zzzkky的个人博客',
                        url: 'http://zzzkky.cn'
                    }
                ]);
                break;
            default:
                res.reply('无该操作')
        }
    }
};

// 00_00
var userInfo = function (message, res) {
    var user = connect.collection('user');
    user.find({"userName": message.FromUserName}).toArray(function(err, result) {
        var reply = "";
        if (result.length > 0) {
            if (result[0].name) {reply += "姓名: " + result[0].name + "\n"}
            else {reply += "姓名: 暂无\n"}
            if (result[0].sex) {reply += "性别: " + result[0].sex +"\n"}
            else {reply += "性别: 暂无\n"}
            if (result[0].phone) {reply += "手机: " + result[0].phone + "\n"}
            else {reply += "手机: 暂无\n"}
            if (result[0].idCard) {reply += "身份证: " + result[0].idCard + "\n"}
            else {reply += "身份证: 暂无\n"}
            reply += "回复\"000\"修改个人信息";
            res.reply(reply);
        } else {
            user.insertOne({"userName": message.FromUserName}, function(err, result){});
            reply += "新用户创建成功\n姓名: 暂无\n性别: 暂无\n手机: 暂无\n身份证: 暂无\n回复\"000\"修改个人信息";
            res.reply(reply);
        }
    });
};

// 01_01
var myTeam = function (message, res) {
    var user = connect.collection('user');
    var team = connect.collection('lingang_team');
    user.find({"userName": message.FromUserName}).toArray(function(err, result) {
        // 如果个人信息不完整
        if (result.length <= 0 || !result[0].name || !result[0].sex || !result[0].phone || !result[0].idCard) {
            res.reply("请先补全个人信息");
            return;
        }

        // 已加入队伍
        if (result[0].lingang_team) {
            var reply = "";
            team.find({num: result[0].lingang_team}).limit(1).next(function(err, team_result) {
                console.log(team_result);
                reply += "队伍名称: " + team_result.name + "\n";
                reply += "队伍编号: " + team_result.num + "\n";
                user.find({userName: team_result.leader}).limit(1).next(function(err, result) {
                    reply += "队长: " + result.name + "\n";
                    user.find({$or: team_result.user.map(function(e){return {"userName": e}})}).toArray(function (err, result) {
                        for (var i = 0; i < result.length; i++) {
                            reply += "成员" + (i+1) + ": " + result[i].name + "\n";
                        }
                        if (team_result.apply == 1) {reply += "参加比赛: 业余一级\n" }
                        else if (team_result.apply == 2) {reply += "参加比赛: 业余二级\n" }
                        else if (team_result.apply == 3) {reply += "参加比赛: 业余三级\n" }
                        else if (team_result.apply == 4) {reply += "参加比赛: 业余四级\n" }
                        else {reply += "\n未参加比赛,请队长报名参赛\n" }

                        if (message.FromUserName == team_result.leader) {
                            if (team_result.apply >= 1) {
                                reply += "\n队长回复\"103\"退出比赛\n" +
                                        "队长回复\"104\"解散队伍\n" +
                                        "队长回复\"105 成员编号\"踢出成员";
                            } else {
                                reply += "\n队长回复\"102 等级\"报名\n" +
                                        "例如:\"102 3\"表示参加业余三级比赛\n" +
                                        "队长回复\"105 成员编号\"踢出成员";
                            }
                        } else {
                            reply += "\n回复\"106\"退出队伍"
                        }
                        res.reply(reply);
                    });
                });
            });
            return;
        }

        // 没有加入队伍
        res.reply('暂无队伍\n' +
            '回复\"序号 空格 内容\"加入队伍或创建队伍\n' +
            '100: 加入队伍,内容是队伍编号\n' +
            '101: 创建队伍,内容是新建的队伍名称');
    });
};


module.exports = wechat_AI;
