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

        religion: {
            default: 50,
            visible: true,
            tooltip: "宗教属性值",
        },

        populace: {
            default: 50,
            visible: true,
            tooltip: "人口"
        },

        army:{
            default: 50,
            visible: true,
            tooltip: "军队数值",
        },

        economics:{
            default: 50,
            visible: true,
            tooltip: "经济数值"
        },

        religionLabel: {
            default: null,
            type: cc.Label,
            tooltip: "宗教属性值标签"
        },

        populaceLabel:{
            default: null,
            type: cc.Label,
            tooltip: "人口属性标签"
        },

        armyLabel:{
            default: null,
            type: cc.Label,
            tooltip: "军队属性标签"
        },
        economicsLabel:{
            default: null,
            type: cc.Label,
            tooltip: "经济标签"
        },

        cardNum: {
            default: 0,
            visible: false,
            tooltip: "使用了多少卡牌"
        },

        cardNumLabel: {
            default: null,
            type: cc.Label,
            tooltip: "使用了多少卡牌"
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 初始化数据
        this.setLabelValue();
    },

    start () {

    },

    setLabelValue : function (){
        this.religionLabel.string = "宗教：" + this.religion;
        this.populaceLabel.string = "人口：" + this.populace;
        this.armyLabel.string = "军队：" + this.army;
        this.economicsLabel.string = "经济：" + this.economics;

    },

    getRandomNumber : function() {
        return cc.rand()%10 - 5
    },

    updateVale : function () {
        if (cc.randomMinus1To1() > 0)
        {
            this.religion += getRandomNumber()
        }
        
        if (cc.randomMinus1To1() > 0)
        {
            this.populace += getRandomNumber()
        }

        if (cc.randomMinus1To1() > 0)
        {
            this.army += getRandomNumber()
        }

        if (cc.randomMinus1To1() > 0)
        {
            this.economics += getRandomNumber()
        }
    }
    // update (dt) {},
});
