module.exports = {
    //进入房间
    enterRoom : {cmd : 100,value : ["roomID"]},
    //房间列表
    roomList : {cmd : 101,value : ["roomArr"]},
    //创建房间
    createRoom : {cmd : 102,value : ""},
    //更新用户信息
    userInfo :{cmd : 103},
    //开始游戏
    startGame : {cmd:104},
    //开始出牌
    roundStart : {cmd : 105},
    //出牌
    showCard : {cmd:106,value :"cardInfo"},
    //国王选择
    makeChoice : {cmd :107,value:"agree"},
    //游戏结果
    gameOver : {cmd:108},
    //退出房间
    outRoom : {cmd:109,},

    convertToData : function(str){
        console.log(str)
        var ob = JSON.parse(str)
        return ob
    },

    convertToString: function(object){
        var str = JSON.stringify(object)
        //console.log(str)

        return str
    },


}