// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var csv = require("CSV")
var Tool = require("tools")
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

        religion: {
            default: 50,
            visible: false,
            tooltip: "宗教属性值",
        },

        populace: {
            default: 50,
            visible: false,
            tooltip: "人口"
        },

        army:{
            default: 50,
            visible: false,
            tooltip: "军队数值",
        },

        economics:{
            default: 50,
            visible: false,
            tooltip: "经济数值"
        },

        religionProgress: {
            default: null,
            type: cc.ProgressBar,
            tooltip: "宗教属性值标签"
        },

        populaceProgress:{
            default: null,
            type: cc.ProgressBar,
            tooltip: "人口属性标签"
        },

        armyProgress:{
            default: null,
            type: cc.ProgressBar,
            tooltip: "军队属性标签"
        },
        economicsProgress:{
            default: null,
            type: cc.ProgressBar,
            tooltip: "经济标签"
        },

        cardDesLabel:{
            default:null,
            type:cc.Label,
            tooltip:"卡牌描述标签",
        },

        cardNum: {
            default: 0,
            visible: false,
            tooltip: "回合数"
        },

        cardNumLabel: {
            default: null,
            type: cc.RichText,
            tooltip: "回合数"
        },

        card:{
            default: null,
            type:cc.Sprite,
            tooltip: "当前正在选择的卡牌"
        },

    },

    isTouchDone : false,
    cardInfo : null,    //当前卡牌信息

    onLoad () {
        // 初始化数据
        this.overView = cc.find("Canvas/mask")

        this.reStart()
    },

    //注册监听事件
    registListener : function () {
        this.node.on('touchstart',this.ontouchstart,this);
        this.node.on('touchmove',this.ontouchmove,this);
        this.node.on('touchend',this.ontouchEnd,this);
    },

    //删除监听事件
    removeListener : function () {
        this.node.off('touchstart',this.ontouchstart,this);
        this.node.off('touchmove',this.ontouchmove,this);
        this.node.off('touchend',this.ontouchEnd,this);
    },

    start () {

    },

    getCard:function(){
        var cards = csv.modules.Card
        var index = Math.floor(Math.random()* cards.length)
        this.cardInfo =  cards[index]
    },

    showCard : function (){
        if (this.cardInfo)
        {
            this.cardDesLabel.string = this.cardInfo.QuesDes
        }
    },

    //更新面板数值显示
    setLabelValue : function (){
        this.religionProgress.progress =  Tool.clamp(this.religion) / 100 ;
        this.populaceProgress.progress = Tool.clamp(this.populace)/100;
        this.armyProgress.progress = Tool.clamp(this.army)/100;
        this.economicsProgress.progress = Tool.clamp(this.economics)/100;
        this.cardNumLabel.string = "<color=#FFFFFF>" + this.cardNum + " / </c><color=#03C2C4>10</color>"

    },

    // getRandomNumber : function() {
    //     return Math.round(cc.rand()%30 - 15)
    // },

    //计算数值
    updateVale : function (agree) {
        if(agree)
        {
            this.religion += this.cardInfo.Religion1
            this.populace += this.cardInfo.Populace1
            this.army += this.cardInfo.Army1
            this.economics += this.cardInfo.Economics1
        }else
        {
            this.religion += this.cardInfo.Religion2
            this.populace += this.cardInfo.Populace2
            this.army += this.cardInfo.Army2
            this.economics += this.cardInfo.Economics2
        }
    },

    //检查游戏状态
    checkGameState : function() {
        if (Math.max(this.religion,this.populace,this.army,this.economics) >= 100 || Math.min(this.religion,this.populace,this.army,this.economics) <= 0)
            this.GameOver()
        else
            this.goNext()
    },

    //游戏结束
    GameOver :function() {
        this.removeListener()
        this.overView.active = true
    },

    reStart : function() {
        // 开启触摸监听
        this.registListener()

        // reset value
        this.religion = 50
        this.populace = 50
        this.army = 50
        this.economics = 50
        this.cardNum = 0
        this.getCard()

        // 更新显示
        this.setLabelValue()
        this.showCard()
    },
    // 做出选择
    makeChoice : function (agree){
        this.updateVale(agree)
        this.cardNum += 1
        this.setLabelValue()

        this.checkGameState()
    },

    goNext : function(){
        this.getCard()
        this.showCard()
    },

    //触摸开始
    ontouchstart : function (event) {
        this.isTouchDone = false
        this.cardPosition = this.card.node.getPosition()
        //console.log("card position",this.cardPosition.x,this.cardPosition.y)
    },

    //触摸移动
    ontouchmove :function (event){
        if (this.isTouchDone)
            return;
        var startPos = event.getStartLocation()
        var curPos = event.getLocation()
        var dx = curPos.x - startPos.x
        //console.log("touch position",curPos.x,curPos.y)
        if (Math.abs(dx) < 300)
        {
            this.card.node.setPositionX(this.cardPosition.x + dx)
        }
        else
        {
            this.makeChoice(dx<0)
            this.isTouchDone = true
            this.card.node.setPosition(this.cardPosition)
        }
        
    },

    //触摸结束
    ontouchEnd : function (event) {
        this.card.node.setPosition(this.cardPosition)
    }
    // update (dt) {},
});
