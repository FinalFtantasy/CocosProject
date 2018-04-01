// CSv读表逻辑
var tool = require("tools")

var CSV = {
    modules : {},
    init : function () {
        this.modules.Card = require("Card")
    },

    getCardByID(id){
        var cards = this.modules.Card
        for(var k in cards)
        {
            if(cards[k].QuestionID == id)
                return cards[k]
        }
        console.log("卡牌没找到："+id)
    },
}

CSV.init()

module.exports = CSV
