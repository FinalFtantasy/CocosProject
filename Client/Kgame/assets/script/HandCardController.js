
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
        card :{
            default:null,
            type:cc.Sprite,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.game = cc.find("Canvas").getComponent("GameController")
    },

    start () {
        this.node.on('touchstart',this.ontouchstart,this);
        this.node.on('touchmove',this.ontouchmove,this);
        this.node.on('touchend',this.ontouchEnd,this);
        this.node.on('touchcancel',this.ontouchCancel,this)
    },

    // update (dt) {},

    setCardInfo(info){
        this.cardInfo = info
        var card = this.card
        cc.loader.loadRes("Card/" + this.cardInfo.CardID, cc.SpriteFrame, function (err, spriteFrame) {
            if(!err)
            {
                card.spriteFrame = spriteFrame;
            }
        });
    },
    getCardInfo(){
        return this.cardInfo
    },
    ontouchstart(event){
        event.stopPropagation()
        this.isTouchDone = false
        this.isShowInfo = true
        this.cardPosition = this.node.getPosition()
    },

    ontouchmove(event){
        if (this.isTouchDone)
            return;
        var startPos = event.getStartLocation()
        var curPos = event.getLocation()
        var dy = curPos.y - startPos.y
        //console.log("touch position",curPos.x,curPos.y)
        if (dy>0 && dy < 200)
        {
            this.node.setPositionY(this.cardPosition.y + dy)
        }
        this.isShowInfo = dy < 80
    },

    ontouchCancel(){
        this.ontouchEnd()
    },

    ontouchEnd(event){
        if(this.isShowInfo)
        {
            //显示详情
            this.game.showCardInfo(this.cardInfo)
        }
        else
        {   //出牌
            this.game.selectCardToServer(this.cardInfo)
        }
        this.node.setPosition(this.cardPosition)
    },
});
