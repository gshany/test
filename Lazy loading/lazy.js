
function initLazyImg(defaultSrc) {
  
    // 得到所有具有属性data-src的元素，返回一个伪数组
    var imgs = document.querySelectorAll("[data-src]");
    imgs = Array.from(imgs); //Array.from方法可以将一个伪数组转换为真数组
    //1. 设置默认图片
    setDefault();

    //2. 懒加载图片
    loadImgs();

    var timer = null; //保存计时器的id
    //3. 注册滚动时间
    window.addEventListener("scroll", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            //500毫秒之后，再进行懒加载
            loadImgs();
        }, 500);
    })

    /**
     * 设置默认图片
     */
    function setDefault() {
        //获取所有需要懒加载的图片
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].src = defaultSrc;
        }
    }


    function loadImgs() {
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i]; //拿到当前的图片
            //如果该图片已经进行了加载，则将该图片从数组中移除
            if (loadImg(img)) {
                imgs.splice(i, 1);
                i--; //不要忘记下标减1
            }
        }
    }

   
     
    function loadImg(img) {  
       
        var rect = img.getBoundingClientRect();

        if (rect.right > 0 && rect.left < document.documentElement.clientWidth &&
            rect.bottom > 0 && rect.top < document.documentElement.clientHeight) {
            //该元素在视口范围内
            img.src = img.dataset.src;  
            return true;//表示进行了懒加载
        }
        return false;//表示没有进行懒加载
        
    }
}