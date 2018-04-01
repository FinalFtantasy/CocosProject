
//全局数据存储
module.exports = {
    ip : "",
    users : null,
    role : -1,
    roomID : 0,

    refreshUserInfo:function(){
        for(var k in this.users)
        {
            var user = this.users[k]
            if(this.ip == user.IP)
            {
                this.role = user.roler
            }
        }
    },
}