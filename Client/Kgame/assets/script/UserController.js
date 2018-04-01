//房间列表界面
var Socket = require("Socket")
cc.Class({
    extends: cc.Component,

    properties: {
        content : {
            default:null,
            type:cc.Node,
            tooltip:"list节点"
        },

        roomCell : {
            default:null,
            type:cc.Prefab,
            tooltip:"roomcell预设体"
        },

        audio: {
            url: cc.AudioClip,
            default: null
        },
    },

    cellNum : 0,

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Socket.init()
    },

    start () {
        Socket.send({cmd : 101,})
        this.currentAudio = cc.audioEngine.play(this.audio, true, 1);
    },

    onDestroy: function () {
        cc.audioEngine.stop(this.currentAudio);
    },

    // update (dt) {},

    showRoomList:function(list){
        this.cellNum = 0
        this.content.removeAllChildren()
        for (var k in list)
        {
            var node = cc.instantiate(this.roomCell)
            node.parent = this.content
            node.setPositionY(-this.cellNum*110)
            node.getComponent("RoomCellController").setInfo(list[k])
            this.cellNum++ 
        }

        this.cellNum = list.length
    },

    onCreateBtnClick(){
        //创建房间
        Socket.send({cmd : 102,})
    }
});
