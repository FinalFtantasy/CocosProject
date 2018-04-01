var proto = require("proto")
var config = require("Config")
var tool = require("tools")
module.exports = {
    ws : null,

    init : function(){
        var url = "wss://xyx.lilithgame.com:10040"
        //var url = "ws://127.0.0.1:10040"
        if (!this.ws)
        {
            this.ws = new  WebSocket(url)

            this.ws.onopen = this.onOpen;
            this.ws.onmessage = this.onMessage;
            this.ws.onerror = this.onError;
            this.ws.onclose = this.onClose;
        }
    },

    onOpen: function(event) {
        
        //tool.dump(event)


        console.log("[WebSocket] WS was opened " + config.ip);
    },

    onMessage : function(event){
        console.log("[WebSocket] response msg: " + event.data);
        var str = event.data
        var object = JSON.parse(str)
        switch(object.cmd)
        {
            case 100:
                //进入房间
                var curscene = cc.director.getScene()
                config.users = object.users
                config.roomID = object.roomID
                config.refreshUserInfo()
                if (curscene.name == "KGameRoom")
                {
                    var rc = cc.find("Canvas").getComponent("RoomController")
                    rc.showUsers()
                }
                else
                {
                    cc.director.loadScene("KGameRoom",function(){
                        var rc = cc.find("Canvas").getComponent("RoomController")
                        rc.showUsers()
                    })
                }
                break;
            case 101:
                //房间列表
                var uc = cc.find("Canvas").getComponent("UserController")
                uc.showRoomList(object.roomList)
                break;
            case 103:
                // 玩家ip
                config.ip = object.ip
                break
            case 105:
                // 开始出牌
                var curscene = cc.director.getScene()
                var curUser = object.cur
                var round = object.round
                if (curscene.name == "KGamePlay")
                {
                    var gc = cc.find("Canvas").getComponent("GameController")
                    gc.onSelectCard(curUser,round)
                }
                else
                {
                    cc.director.loadScene("KGamePlay",function(){
                        var gc = cc.find("Canvas").getComponent("GameController")
                        gc.onSelectCard(curUser,round)
                    })
                }
                break;
            case 106:   
                // 收到出牌结果
                var gc = cc.find("Canvas").getComponent("GameController")
                if(gc)
                {
                    gc.onSelectCardResult(object.cardID)
                }
                else
                    console.log("[err cmd106] 场景错误")
                break
            case 107:
                // 收到国王选择结果
                var gc = cc.find("Canvas").getComponent("GameController")
                if(gc)
                {
                    gc.onChoiceResult(object.agree)
                }else
                    console.log("[err cmd106] 场景错误")
                break
            case 108:
                var gc = cc.find("Canvas").getComponent("GameController")
                if(gc)
                {
                    gc.onGameOver(object.winner)
                }else
                    console.log("[err cmd106] 场景错误")
                break
            case 109:
                cc.director.loadScene("KGameMain")
                break
            default:break;
        }
    },

    onError :function(event){
        console.log("[WebSocket] Send Text fired an error");
        //console.log("[WebSocket] " + event.data);
        // tool.dump(event)
    },

    onClose :function(event){
        console.log("[WebSocket] WebSocket instance closed.");
        console.log("Error Code: "+event.code + "  Reason: " + event.reason)
        // tool.dump(event)
    },

    send:function (object){
        var data = proto.convertToString(object)
        console.log("[send]" + data)
        if (this.ws && data)
        {
            this.ws.send(data)
        }
    },

    readState:function(){
        return this.ws.readyState
    } 
}
