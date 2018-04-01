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

    dump : function (object,n,key){
        var name
        if(key)
            name = key
        else
            name = "objeckt"
        if(!n)
        {
            n = 1
        }
        else
            n = n + 1

        cc.log("==>[dump] var " + name + " = {")
        for(var v in object)
        {
            if (typeof object[v] == "object")
            {

                this.dump(object[v],n,v)
            }
            else if(typeof object[v] == "function")
            {
                cc.log(this.getTabl(n) + '['+ v +']: ' + "[" + typeof object[v] + "] :")
            }else
                cc.log(this.getTabl(n) + '['+ v +']: ' + "[" + typeof object[v] + "] :" + object[v])
        }
        cc.log(this.getTabl(n)+'}')
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
