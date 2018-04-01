// 房间界面
var config =require("Config")
var socket = require("Socket")
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        users :{
            default : [],
            visible:false,
            tooltip:"玩家列表"
        },

        user1 :{
            default:null,
            type:cc.Sprite,
            tooltip:"玩家1"
        },
        user2 :{
            default:null,
            type:cc.Sprite,
            tooltip:"玩家2"
        },
        user3 :{
            default:null,
            type:cc.Sprite,
            tooltip:"玩家3"
        },

        startBtn :{
            default:null,
            type:cc.Node,
            tooltip:"开始按钮"
        },

        audio: {
            url: cc.AudioClip,
            default: null
        },

        helpView :{
            default:null,
            type:cc.Node,
            tooltip:"帮助"
        },
    },

    //注册监听事件
    registListener : function () {
        this.node.on('touchstart',this.ontouchstart,this);
        this.node.on('touchmove',this.ontouchmove,this);
        this.node.on('touchend',this.ontouchEnd,this);
        this.node.on('touchcancel',this.ontouchCancel,this);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.setDisplayStats(false)
        this.roomID = 0
        this.roler = -1
        this.users =[]

        this.registListener()
    },

    start () {
        this.showUsers()
        this.currentAudio = cc.audioEngine.play(this.audio, true, 1);
    },

    onDestroy: function () {
        cc.audioEngine.stop(this.currentAudio);
    },
    // update (dt) {},

    //刷新玩家
    showUsers(){
        this.roomID = config.roomID
        this.users = config.users
        for(var k=0;k<3 ; k++)
        {
            var usr = this.users[k]
            var na = 'user' + (k+1).toString()
            var sp = this[na].node
            if(usr)
            {
                sp.active = true
                var label = sp.getChildByName("name").getComponent(cc.Label)
                if(usr.IP == config.ip)
                {
                    label.string = "我"
                    this.roler = usr.roler
                    this.startBtn.active = usr.roler == 0
                }
                   
                else
                    label.string = "玩家"
            }
            else
            {
                sp.active = false
            }

        }
    },

    onStartClick(){
        if (this.roler == 0 && config.users.length > 1)
        {
            socket.send({
                cmd : 104
            })
            cc.director.loadScene('KGamePlay')
        }
        else
            log("不是房主"+this.roler)
    },

    onBackClick(){
        //离开房间
        socket.send({cmd : 109,})
    },

    onhelpClick(){
        this.helpView.active = true
    },

    ontouchstart(){
        this.helpView.active = false
    },

    ontouchmove(){

    },

    ontouchEnd(){

    },

    ontouchCancel(){

    },
        
});
