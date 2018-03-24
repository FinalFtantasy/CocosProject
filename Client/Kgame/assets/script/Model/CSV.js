// CSv读表逻辑
var tool = require("tools")

var CSV = {
    modules : {},
    init : function () {
        this.modules.Card = require("Card")
    }
}

CSV.init()

module.exports = CSV
