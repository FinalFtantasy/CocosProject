// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
    },

    // LIFE-CYCLE CALLBACKS:

    //注册监听事件
    registListener : function () {
        this.node.on('touchstart',this.ontouchstart,this);
        this.node.on('touchmove',this.ontouchmove,this);
        this.node.on('touchend',this.ontouchEnd,this);
        this.node.on('touchcancel',this.ontouchCancel,this);
    },

    //删除监听事件
    removeListener : function () {
        this.node.off('touchstart',this.ontouchstart,this);
        this.node.off('touchmove',this.ontouchmove,this);
        this.node.off('touchend',this.ontouchEnd,this);
        this.node.off('touchcancel',this.ontouchCancel,this);
    },

    onLoad () {
        this.game = cc.find("Canvas").getComponent("GameController")
        this.chooseLabel = cc.find("Canvas/card/chooseLabel").getComponent(cc.Label)
        
        this.registListener()
    },

    start () {

    },

    // update (dt) {},

     //触摸开始
     ontouchstart : function (event) {
        event.stopPropagation()
        this.isSelect = false
        this.lastDir = null
        this.cardPosition = this.node.getPosition()

        this.chooseLabel.string = ""
        return true
    },

    //触摸移动
    ontouchmove :function (event){
        if ( !this.game.isKing() && !this.game.isShowInfo())
        {// 平民不能移动场上的牌
            return;
        }
        var startPos = event.getStartLocation()
        var curPos = event.getLocation()
        var dx = curPos.x - startPos.x
        this.isLeft = dx<0;
        //console.log("touch position",curPos.x,curPos.y)
        if (Math.abs(dx) < 250)
        {
            this.isSelect = false
            this.node.setPositionX(this.cardPosition.x + dx/250 * 30)
            this.node.rotation = dx/250 * 11

            if(this.lastDir != this.isLeft)
            {//左右切换了
                if(this.game.isKing())
                {   //国王 显示伤害和选择描述
                    this.game.showDamage(this.isLeft)
                    if(this.isLeft)
                        this.chooseLabel.string = this.game.getCardInfo().Description1
                    else
                        this.chooseLabel.string = this.game.getCardInfo().Description2
                }else
                {   //大臣 显示趋势
                    this.game.showUP(this.isLeft)
                }
            }
        }
        else
        {
            this.isSelect = true
        }

        this.lastDir = this.isLeft
    
    },

    //触摸取消
    ontouchCancel:function(){
        if(this.cardPosition)
        {
            this.node.rotation = 0
            this.node.setPosition(this.cardPosition)
        }

        this.chooseLabel.string = ""
    },

    //触摸结束
    ontouchEnd : function (event) {
        if(this.cardPosition)
        {
            this.node.rotation = 0
            this.node.setPosition(this.cardPosition)
        }

        if(this.game.isKing() )
        {//国王
            if(this.isSelect)
                this.game.makeChoice(this.isLeft)

            this.game.hideDamage()
        }else
        {
            if(this.game.isShowInfo())
                this.game.showUP()
        }
            

        this.chooseLabel.string = ""
    },
});
