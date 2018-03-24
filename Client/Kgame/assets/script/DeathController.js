// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var con = cc.Class({
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

        deathDec : {
            default : null,
            type : cc.Label,
            tooltip : "死亡描述"
        },



    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.cascadeOpacity = false
        this.game = cc.find("Canvas").getComponent("GameController")

    },

    start () {
        console.log("death on start")
        this.node.on("touchstart",this.onTouchStart,this)
    },

    showView : function() {
        this.node.active = true;
    },

    onEnable(){
        console.log("death on onEnable")
        //this.deathDec.string = "you dead"
    },

    onDisable() {
        console.log("death on onDisable")
        //this.node.off("touchstart",this.onTouchStart,this)
    },

    onTouchStart : function (event) {
        console.log("death on touch start")
        this.node.active = false
        this.game.reStart()
    }

    // update (dt) {},
});

module.exports = con