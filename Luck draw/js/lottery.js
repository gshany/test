
function Lottery() {
    this.bool = true;
    this.body = document.getElementsByTagName('body')[0]
    this.rotateNum = 5;
    this.init();
}



  Lottery.prototype.init = function () {
    var self = this;
    this.btn = this.body.getElementsByClassName('btn')[0];
    this.bigWheel = this.body.getElementsByClassName('pan')[0];

    this.btn.addEventListener('click', function (e) {
        if (self.bool) {
            self.btnClick();    // btnClick
            self.bool = false;
        }
    })

    // btnClick
    Lottery.prototype.btnClick = function () {
        var num = Math.floor(Math.random() * 360);
        this.tableRun(num);    // tableRun
    }


    // tableRun
    Lottery.prototype.tableRun = function (deg) {
        var num = deg + this.rotateNum * 360;
        this.bigWheel.style.transform = 'rotate(' + num + 'deg)';
        this.bigWheel.style.transition = 'all 5s';
    
        this.myNum = deg;
        console.log(this);
    }

    // judgeFn
    this.bigWheel.addEventListener('webkitTransitionEnd', function () {

        self.bigWheel.style.transform = 'rotate(' + self.myNum + 'deg)';
        self.bigWheel.style.transition = 'none';
        self.judgeFn(self.myNum);
        self.bool = true;
    })
}


 // judgeFn
Lottery.prototype.judgeFn = function (deg) {
    var str = '';
    if (deg < 45 && deg < 270 && deg > 0) {
        //二等奖
        str = '二等奖'
    } else if (deg > 90 && deg < 135 || deg > 270 && deg < 315) {
        //三等奖
        str = '三等奖'
    } else if (deg > 45 && deg < 90 || deg > 135 && deg < 180 || deg > 225 && deg < 270 || deg > 315 && deg < 360) {
        //四等奖
        str = '四等奖'
    } else if (deg > 180 && deg < 225) {
        str = '一等奖'
        //一等奖
    }

    alert('大吉大利 恭喜获得' + str + '!')


}



