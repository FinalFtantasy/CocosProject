// 工具类

var tool = {
    getTabl : function(n){
        var tab = ""
        for (i=0;i<n;i++)
        {
            tab += "\t"
        }
        return tab
    },

    dump : function (object,n){
        if(!n)
        {
            n = 1
            cc.log("==>[dump] var object = {")
        }
        else
            n = n + 1

        for(var v in object)
        {
            if (typeof object[v] == "object")
            {

                this.dump(object[v],n)
            }
            else
                cc.log(this.getTabl(n) + v + "[" + typeof object[v] + "] : " + object[v])
        }
    },

    clamp: function (value, max,min){
        if (!max)
            max = 100
        if (!min)
            min = 0
        return Math.min(max,Math.max(value,min))
    },
};

module.exports = tool
