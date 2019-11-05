var divCharators = document.getElementById("charactors"); //放置英雄和怪物的容器
//一些配置
var config = {
    containerWidth: 512, //容器宽度
    containerHeight: 480, //容器高度
    durationForMove: 16, //移动计时器时间间隔，单位毫秒
    durationForCreateMonster: 1500, //产生怪物的计时器的间隔
    durationForTime: 16, //计算时间的计时间隔
}
var timerForMove; //让所有英雄和怪物移动的计时器
var timerForCreateMonster; //产生怪物的计时器
var monsters = []; //怪物的数组
var timerForTime; //用于计算时间的计时器

/**
 * 英雄对象
 */
var hero = {
    width: 32,
    height: 32,
    left: 0,
    top: 0,
    speed: 150, //如果有速度，则横向和纵向的速度取值的绝对值
    dom: document.createElement("div"), //英雄对应的dom元素
    isInit: false, //是否已经完成过初始化
    xSpeed: 0, //横坐标上的速度，向右为正数，向左为负数，单位是 像素/秒,
    ySpeed: 0, //纵坐标上的速度，向下为正数，向上为负数，单位是 像素/秒
    show: function () { //在页面中显示英雄
        if (!this.isInit) {
            //还没有初始化
            this.dom.className = "hero";
            divCharators.appendChild(this.dom);
            this.isInit = true; //已完成初始化
            //设置初始位置
            this.left = config.containerWidth / 2 - this.width / 2;
            this.top = config.containerHeight / 2 - this.height / 2;
        }
        this.dom.style.left = this.left + "px";
        this.dom.style.top = this.top + "px";
    },
    /**
     * 根据英雄当前的速度，和经过的时间 移动英雄（改变英雄的横纵坐标）
     * @param {*} duartion 经过的时间，单位是 秒
     */
    move: function (duartion) {
        var xDis = this.xSpeed * duartion; //横向移动的距离
        var yDis = this.ySpeed * duartion; //纵向移动的距离
        var newLeft = this.left + xDis; //新的横坐标
        var newTop = this.top + yDis; //新的纵坐标
        //处理边界
        //横向的边界
        if (newLeft < 0) {
            newLeft = 0;
        }
        else if (newLeft > config.containerWidth - this.width) {
            newLeft = config.containerWidth - this.width;
        }
        //纵向的边界
        if (newTop < 0) {
            newTop = 0;
        }
        else if (newTop > config.containerHeight - this.height) {
            newTop = config.containerHeight - this.height;
        }

        this.left = newLeft;
        this.top = newTop;
        this.show(); //重新显示
    },
    /**
     * 添加事件处理
     */
    addEvent: function () {
        //这里的this指向当前英雄对象
        var that = this; //保存this到一个变量中
        window.onkeydown = function (e) {
            //this指向window
            if (e.key === "ArrowUp") {
                that.ySpeed = -that.speed;
            }
            else if (e.key === "ArrowDown") {
                that.ySpeed = that.speed;
            }
            else if (e.key === "ArrowLeft") {
                that.xSpeed = -that.speed;
            }
            else if (e.key === "ArrowRight") {
                that.xSpeed = that.speed;
            }
        }

        window.onkeyup = function (e) {
            //this指向window
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                //抬起的是上下键
                that.ySpeed = 0;
            }
            else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                that.xSpeed = 0;
            }
        }
    }
}

/**
 * 计时器对象
 */
var time = {
    dom: document.getElementById("time"),
    miliSec: 0, //表示经过了多少毫秒
    start: function () {
        var that = this;
        //启动，开始计时
        timerForTime = setInterval(function () {
            that.miliSec += config.durationForTime; //增加经过的时间
            that.dom.innerText = that.toString();
        }, config.durationForTime);
    },
    toString: function () {
        //将当前计时器的毫秒，转换为一个友好的字符串返回
        //1000  ->   00:01:00
        //1520  ->   00:01:52
        var temp = this.miliSec;
        var minute = Math.floor(temp / 60000); //得到分钟的整数
        temp %= 60000; //得到剩余的时间
        var second = Math.floor(temp / 1000) //得到秒的整数
        temp %= 1000; //得到剩余的时间
        var miliSec = temp; //得到剩余的毫秒

        //分钟和秒钟必须是两位数
        //padStart 如果给定的字符串不满足指定的位数，则向该字符串左边填充指定的字符
        minute = minute.toString().padStart(2, "0");
        second = second.toString().padStart(2, "0");
        //毫秒必须是两位数
        miliSec = Math.floor(miliSec / 10).toString().padStart(2, "0");

        return minute + ":" + second + ":" + miliSec;
    }
}

/**
 * 根据指定的最小值和最大值，产生一个随机整数
 * @param {*} min 
 * @param {*} max 
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}



/**
 * 创建一个怪物
 */
function createMonster() {
    var monster = {
        width: 30,
        height: 32,
        left: 0,
        top: 0,
        dom: document.createElement("div"),
        isInit: false, //是否已完成初始化
        xSpeed: getRandom(40, 100),
        ySpeed: getRandom(40, 100),
        show: function () {
            if (!this.isInit) {
                //还没有初始化
                this.dom.className = "monster";
                divCharators.appendChild(this.dom);
                this.isInit = true; //已完成初始化
            }
            this.dom.style.left = this.left + "px";
            this.dom.style.top = this.top + "px";
        },
        move: function (duartion) {
            var xDis = this.xSpeed * duartion; //横向移动的距离
            var yDis = this.ySpeed * duartion; //纵向移动的距离
            var newLeft = this.left + xDis; //新的横坐标
            var newTop = this.top + yDis; //新的纵坐标
            //处理边界
            //横向的边界
            if (newLeft < 0) {
                newLeft = 0;
                this.xSpeed = -this.xSpeed;
            }
            else if (newLeft > config.containerWidth - this.width) {
                newLeft = config.containerWidth - this.width;
                this.xSpeed = -this.xSpeed;
            }
            //纵向的边界
            if (newTop < 0) {
                newTop = 0;
                this.ySpeed = -this.ySpeed;
            }
            else if (newTop > config.containerHeight - this.height) {
                newTop = config.containerHeight - this.height;
                this.ySpeed = -this.ySpeed;
            }

            this.left = newLeft;
            this.top = newTop;
            this.show(); //重新显示
        }
    }

    monster.show();

    //返回的的目的是，init里面 这句代码 var m = createMonster();  如果没有返回值那么 m就没有值就会报错
     return monster;
}

/**
 * 初始化游戏
 */
function init() {
    hero.show(); //显示英雄
    hero.addEvent();//让键盘按键控制英雄
    //每隔一段时间，产生一个怪物
    timerForCreateMonster = setInterval(function () {
        var m = createMonster();
        // console.log(m)
        monsters.push(m);
    }, config.durationForCreateMonster)

    //启动计时器
    timerForMove = setInterval(function () {
        var second = config.durationForMove / 1000;
        //英雄移动
        hero.move(second);
     
        //所有怪物移动
        for (var i = 0; i < monsters.length; i++) {
            var m = monsters[i]; //得到当前怪物
            m.move(second);
        }
        //碰撞检测
        if (isHit()) {
            //是否发生了碰撞
            //游戏结束
            gameOver();
        }
    }, config.durationForMove)
    
    //启动时间
    time.start();
}

function gameOver() {
    //清空所有计时器
    clearInterval(timerForMove);
    clearInterval(timerForCreateMonster);
    clearInterval(timerForTime);
    alert("用时：" + time.toString() + "\n游戏结束！！！");
}

/**
 * 用于检测，英雄是否和其中一个怪物发生了亲密的接触
 */
function isHit() {
    for (var i = 0; i < monsters.length; i++) {
        var m = monsters[i]; //得到当前怪物
        //判断英雄和怪物m是否发生了亲密的接触
        if (_isHit(m)) {
            return true; //接触了
        }
    }
    return false;

    /**
     * 判断，英雄和传入的怪物m，是否接触
     * @param {*} m 
     */
    function _isHit(m) {
        //矩形碰撞检查：实际上，检测的是两个矩形是否相交
        //矩形中心点横向距离绝对值 < 矩形的宽度之和 / 2    并且     矩形中心点纵向距离绝对值 < 矩形高度之和 / 2
        var heroCenterX = hero.left + hero.width / 2; //英雄中心点横坐标
        var heroCenterY = hero.top + hero.height / 2; //英雄中心点纵坐标
        var mCenterX = m.left + m.width / 2; //怪物中心点横坐标
        var mCenterY = m.top + m.height / 2; //怪物中心点纵坐标
        var xiuzheng = 8; //修正值
        if (Math.abs(heroCenterX - mCenterX) < (hero.width + m.width - xiuzheng) / 2 &&
            Math.abs(heroCenterY - mCenterY) < (hero.height + m.height - xiuzheng) / 2
        ) {
            return true;
        }
        return false;
    }
}

init();