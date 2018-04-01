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
var Socket = require("Socket")
var config = require("Config")
var MAXHANDCARD = 4
var progressTime = 10
var USETIMELINE = false
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

        handCards : {
            default : [],
            type:[cc.Sprite],
            tooltip:"玩家手牌",
        },

        timeLine :{
            default:null,
            type:cc.ProgressBar,
            tooltip:"时间进度条",
        },
        deathLabel :{
            default:null,
            type:cc.Label,
        },
        audio: {
            url: cc.AudioClip,
            default: null
        },
        gameModel : 2,
        curProgressTime : progressTime
    },

    isTouchDone : false,
    carCard : null,     //当前场上卡牌
    cardInfo : null,    //预览卡牌信息
    isMyTurn : false,
    onLoad () {
        // 初始化数据
        this.overView = cc.find("Canvas/mask")
        this.handCardNode = cc.find("Canvas/HandCardNode")
        this.CardMask = cc.find("Canvas/CardMask")
        this.stateLabel = cc.find("Canvas/stateLabel").getComponent(cc.Label)
        this.roleName = cc.find("Canvas/card/roleName").getComponent(cc.Label)
        this.leftOption = cc.find("Canvas/option1")
        this.rightOption = cc.find("Canvas/option2")

        this.isOver = false
        this.overView.cascadeOpacity = false
        this.progressArr =[this.religionProgress,this.populaceProgress,this.armyProgress,this.economicsProgress]

        // 开启触摸监听
        this.registListener()

        this.reStart()
    },
    
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

    start () {
        if( this.isKing())
        {
            this.showKingView()
        }else{
            this.showOtherView()
        }
        this.currentAudio = cc.audioEngine.play(this.audio, true, 1);
    },

    onDestroy: function () {
        cc.audioEngine.stop(this.currentAudio);
    },
    
    showKingView(){
        this.handCardNode.active = false
    },

    showOtherView(){
        
        this.initHandCard()
    },

    //收到出牌通知
    onSelectCard(ip,round){
        if(this.isOver)
            return 
        
        this.resetProgress()
        this.cardNum = round
        this.isKingTurn = false
        if(this.isKing())
        {// 我是国王的话什么都不做 等别人出牌
            this.isMyTurn = false
            return
        }
        this.isMyTurn = ip == config.ip
        if(this.isMyTurn)
        {
            this.stateLabel.string = "请出牌"
        }
        else
        {
            this.stateLabel.string = "等待对手出牌"
        }

    },
    //收到出牌结果通知
    onSelectCardResult(cardID){
        this.resetProgress()
        this.isMyTurn = false
        this.isKingTurn = true
        this.carCard = csv.getCardByID(cardID)
        this.hideCardInfo()
        this.stateLabel.string = "等待国王选择"
    },

    //收到选择结果
    onChoiceResult :function(agree){
        this.isKingTurn = false
        if(!this.isKing())
        {
            this.updateVale(agree)
        }
        this.setLabelValue()
        this.checkGameState()
    },

    //游戏结束
    onGameOver:function(winner){
        this.isOver = true
        //this.removeListener()
        this.overView.active = true
        if(this.gameModel > 1)
        {   //多人模式
            if(winner == config.ip)
            {
                if(this.isKing())
                    this.deathLabel.string = "你稳定了政局，建立了盛世"
                else
                    this.deathLabel.string = "你推翻了国王的统治，建立了新的王朝"
            }else
            {
                if(this.isKing())
                {
                    this.deathLabel.string = "你的统治被推翻了，庆幸的是你逃了出来"
                }
                else{
                    this.deathLabel.string = "你在斗争中失败了，对手建立了王朝，你仓皇出逃，寻求东山再起的机会"
                }
            }
        }
    },

    // 做出选择
    makeChoice : function (agree){
        if(this.gameModel == 1)
        {   //单人模式
            this.cardNum += 1
            this.updateVale(agree)
            this.setLabelValue()
            this.checkGameState()
        }
        else
        {   //多人模式
            if(this.isKing())
            {
                //国王
                this.updateVale(agree)
            }
            
            Socket.send({
                cmd:107,
                agree:agree,    //bool
                isDead : this.isDead(),
            })
        }
        
    },
    resetProgress(){
        this.curProgressTime = progressTime
    },

    initHandCard(){
        this.handCardNode.active = true
        for(var k = 0;k<4;k++)
        {
            this.handCards[k].getComponent("HandCardController").setCardInfo(this.getCard())
        }
    },

    //预览卡牌详情
    showCardInfo(cardInfo){
        this.CardMask.active = true
        this.cardInfo = cardInfo
        this.showCard()
        this.showUP()
    },

    // 隐藏卡牌预览
    hideCardInfo(){
        this.CardMask.active = false
        this.cardInfo = this.carCard
        this.showCard()
        this.hideUP()
    },

    isKing(){
        return config.role == 0
    },

    getCard:function(){
        var cards = csv.modules.Card
        var index = Math.floor(Math.random()* cards.length)
        if(this.gameModel == 1)
        {
            this.carCard =  cards[index]
        }
        return cards[index]
    },

    getCurCardInfo(){
        return this.carCard
    },

    getCardInfo(){
        return this.cardInfo
    },

    showCard : function (){
        if (this.cardInfo)
        {
            this.card.node.active = true
            this.cardDesLabel.string = this.cardInfo.QuesDes
            this.roleName.string = this.cardInfo.RoleName
            var card = this.card
            cc.loader.loadRes("Card/" + this.cardInfo.CardID, cc.SpriteFrame, function (err, spriteFrame) {
                if(!err)
                {
                    card.spriteFrame = spriteFrame;
                }
            });
        }
        else
            this.card.node.active = false
    },

    //显示影响趋势
    showUP(isLeft){
        //console.log(isLeft)
        var option1 = [this.cardInfo.Religion1,this.cardInfo.Populace1,this.cardInfo.Army1,this.cardInfo.Economics1]
        var option2 = [this.cardInfo.Religion2,this.cardInfo.Populace2,this.cardInfo.Army2,this.cardInfo.Economics2]

        for(var k=0;k<4;k++)
        {
            var node1 = this.leftOption.getChildByName("up" + (k+1).toString())
            node1.active = option1[k] != 0
            node1.getComponent(cc.Button).interactable = option1[k] > 0
            
            var node2 = this.rightOption.getChildByName("up" + (k+1).toString())
            node2.active = option2[k] != 0
            node2.getComponent(cc.Button).interactable = option2[k] > 0
            
        }
        if(isLeft == null)
        {
            this.leftOption.active = true
            this.rightOption.active = true
        }else{
            this.leftOption.active = isLeft
            this.rightOption.active = !isLeft
        }
    },

    hideUP(){
        this.leftOption.active = false
        this.rightOption.active = false
    },

    //显示影响大小
    showDamage(isLeft){
        var religion,populace,army,economics
        if(isLeft){
            religion = this.carCard.Religion1
            populace = this.carCard.Populace1
            army = this.carCard.Army1
            economics = this.carCard.Economics1
        }else{
            religion = this.carCard.Religion2
            populace = this.carCard.Populace2
            army = this.carCard.Army2
            economics = this.carCard.Economics2
        }

        var valueArr = [religion,populace,army,economics]
        for(var k = 0;k<4;k++)
        {
            var bar = this.progressArr[k]
            var value = valueArr[k]

            var btn = bar.node.getChildByName("damageTag").getComponent(cc.Button)
            btn.node.active = value != 0
            btn.interactable = Math.abs(value) < 20
        }
    },

    hideDamage(){
        for(var k = 0;k<4;k++)
        {
            var bar = this.progressArr[k]
            var btn = bar.node.getChildByName("damageTag").getComponent(cc.Button)
            btn.node.active = false
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
            this.religion += this.carCard.Religion1
            this.populace += this.carCard.Populace1
            this.army += this.carCard.Army1
            this.economics += this.carCard.Economics1
        }else
        {
            this.religion += this.carCard.Religion2
            this.populace += this.carCard.Populace2
            this.army += this.carCard.Army2
            this.economics += this.carCard.Economics2
        }
    },

    //检查游戏状态
    checkGameState : function() {
        if (this.isDead())
            this.onGameOver()
        else
        {
            this.goNext()
        }
           
    },

    isDead(){
        return Math.max(this.religion,this.populace,this.army,this.economics) >= 100 || Math.min(this.religion,this.populace,this.army,this.economics) <= 0
    },

    reStart : function() {
        // reset value
        this.isOver = false
        this.religion = 50
        this.populace = 50
        this.army = 50
        this.economics = 50
        this.cardNum = 0


        if(this.gameModel == 1)
        {   //单人模式
            this.goNext()
        }else if(this.gameModel == 2)
        {

        }else if(this.gameModel == 3)
        {

        }

        // 更新显示
        this.setLabelValue()
        this.showCard()
    },
    

    goNext : function(){
        if(this.gameModel == 1)
        {
            this.cardInfo = this.getCard()
        }else
        {
            this.cardInfo = null
        }
        
        this.showCard()
    },

    isShowInfo(){
        return  this.CardMask.active
    },


    //触摸开始
    ontouchstart : function (event) {

        if(this.CardMask.active)
            this.hideCardInfo()

        return true
    },

    //触摸移动
    ontouchmove :function (event){
    
    },

    //触摸取消
    ontouchCancel:function(){
    },

    //触摸结束
    ontouchEnd : function (event) {
    },

    
    //选择的卡牌给服务器
    selectCardToServer(cardInfo){
        if(this.isMyTurn)
        {
            Socket.send({
                cmd : 106,
                cardID : cardInfo.QuestionID
            }) 
            this.initHandCard() //出完牌重置手牌
        }
    },

    update (dt) {
        if(USETIMELINE && this.curProgressTime >0)
        {
            this.curProgressTime -= dt
            if(this.curProgressTime <=0 )
            {
                if(this.isMyTurn)
                {//出牌时间到强制出第一张
                    var cardInfo = this.handCards[0].getComponent("HandCardController").getCardInfo()
                    this.selectCardToServer(cardInfo)
                }
                else if(this.isKingTurn)
                {//选择时间到默认点头
                    this.makeChoice(false)
                }
                this.curProgressTime = 0
            }
            this.timeLine.progress = this.curProgressTime/progressTime
        }
        
    },
});
