var Socket = require("Socket")

cc.Class({
    extends: cc.Component,

    properties: {
        infoLabel:{
            default:null,
            type:cc.Label,
            tooltip:"房间详情"
        }
    },

    roomInfo : null,
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.cascadeOpacity = false
    },

    setInfo(room){
        var info = "房间：" + room.roomID +" 人数：" + room.userNum
        if (room.roomState)
            info += " 游戏中"
        this.infoLabel.string = info
        this.roomInfo = room
    },

    onClick(){
        // 进入房间
        var ob = {
            cmd : 100,
            roomID : this.roomInfo.roomID
        }
        Socket.send(ob)
    }
    // update (dt) {},
});
