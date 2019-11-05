// 该对象存放所有需要用到的dom元素
var doms = {
    imgContainer: document.querySelector(".img-container"),
    time: document.querySelector(".time"), //倒计时
    divWin: document.getElementById("divwin"),
    divFail: document.getElementById("divfail"),
    divBegin: document.getElementById("divbegin"),
    container: document.querySelector(".container"),
    audBg: document.getElementById("audbg"),
    audRight: document.getElementById("audright"),
    audLose: document.getElementById("audlose"),
    audWin: document.getElementById("audwin"),
};

var cards = []; //用于存放所有卡片对象
var cardNumber = 24; //卡片总数
var maxTime = 630; //总时间：单位秒
var curTime = maxTime; //当前剩余时间
/**
 * 开始游戏
 */
function startGame() {
    //1. 控制元素的显示隐藏
    doms.divBegin.style.display = "none";
    doms.container.style.display = "block";
    //2. 初始化所有卡片
    initCards();
    //3. 启动计时器
    startTime();
    //4. 启动声音
    doms.audBg.play();
}

/**
 * 根据最小值和最大值产生一个随机数
 * @param {*} min 
 * @param {*} max 最大值取不到
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 初始化所有卡片
 */
function initCards() {
    for (var i = 0; i < cardNumber; i += 2) {  //i+=2, 所以要push两次，确保一次有2张相同
        var n = getRandom(1, 13);  //1-12
        cards.push(new Card(n))     //循环一次 加两个一样，这样就不会出现游戏最后出现图片不匹配
        cards.push(new Card(n))     //虽然24张图片，但是数字标记是1-12，我们是一次生成两张一样，接下代码用的上这个理解的意思
    }
    //随机排序
    cards.sort(function () {
        return Math.random() - 0.5;
    })

    //显示
    for (var i = 0; i < cards.length; i++) { 
        doms.imgContainer.appendChild(cards[i].dom)   //cards里面包含很多对象，我们只要他的dom对象
    }
}

/**
 * 创建卡片的构造函数
 */

 //重点：onclick事件，每实例化一次就会生成一个对象，同时这个对象加一个点击事件，this指的的是当前的对象
 //实例化一次对象就会有个的n 自定义的isActive和isClear和一个dom
function Card(n) {
    this.number = n;
    this.isActive = false; //卡片默认没有选中     //这些自定义的属性作用是什么？记住都是人为给他的状态用来接下来if判断
    this.isClear = false; //卡片是否已被消除
    //用于显示到页面上的元素
    this.dom = document.createElement("div");
    this.dom.className = "item";
    this.dom.innerHTML = `<img src="images/role${n}.jpg" alt="">`;
    var that = this;
    //每实例化一次就会生成一个对象，this指的的是当前的对象，也就是你点击哪个对象就是哪个对象
    this.dom.onclick = function () {
        setActive(that)                 //that就是this指向的实例化的对象
        // console.log(that)
    }
}

/**
 * 传递一个card对象，该函数控制该对象的选中
 * @param {*} card 
 */
function setActive(card) {
    if (card.isClear) {
        return;//如果卡片已经被消除了，该操作没有任何意义，(卡片消除只是透明度为0，写这代码，防止点击透明区域也可以消除)
    }
    //得到之前选中的card对象
    var before = getActiveCard();
    //设置当前卡片的选中状态
    card.isActive = true;                //首次触发点击事件后，isActive执行到这一步才改为true  ，第二次点击时候，这个就变成before，以此类推
    card.dom.classList.add("active");
    if (!before) {
        //之前没有任何卡片被选中    后面代码就不会执行 123就不会弹出
        return;
    }
    // alert(123)
    //判断是否能够消除
    if (before.number === card.number) {
        before.isClear = true;                    //这些自定义的属性都是人为给他的状态用来if判断
        card.isClear = true;
        before.dom.style.opacity = 0;
        card.dom.style.opacity = 0;
        //从数组中移除
        removeCard(card);
        removeCard(before);
        //播放消除声音
        doms.audRight.currentTime = 0;//让音频的播放时间回到最开始
        doms.audRight.play();
        //成功消除了
        if (cards.length === 0) {
            gameWin();
        }
    }
    else {
        before.isActive = false; //之前的卡片状态变为false
        before.dom.classList.remove("active");
    }
}

/**
 * 从数组中移除一个卡片对象
 * @param {*} card 
 */
function removeCard(card) {
    var index = cards.indexOf(card);
    cards.splice(index, 1);
}

/**
 * 找到选中的并且没有消失的卡片
 */
function getActiveCard() {
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].isActive && !cards[i].isClear) {
            return cards[i];
        }
    }
}

/**
 * 游戏胜利
 */
function gameWin() {
    doms.container.style.display = "none";
    doms.divWin.style.display = "block";
    clearInterval(timer);
    doms.audWin.play();//播放游戏胜利的音乐
    doms.audBg.pause(); //停止播放背景音乐
}

/**
 * 游戏失败
 */
function gameFail() {
    doms.container.style.display = "none";
    doms.divFail.style.display = "block";
    clearInterval(timer);
    doms.audLose.play();//播放游戏胜利的音乐
    doms.audBg.pause(); //停止播放背景音乐
}

var timer; //用于保存计时器的id
/**
 * 启动倒计时
 */
function startTime() {
    doms.time.innerText = `${curTime}s`;
    timer = setInterval(function () {
        curTime--;//当前剩余时间-1
        doms.time.innerText = `${curTime}s`;
        if (curTime === 0) {
            //游戏失败
            gameFail();
        }
    }, 1000);
}

doms.divBegin.onclick = function () {
    startGame();
};