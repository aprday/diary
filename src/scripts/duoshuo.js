<!-- 多说公共JS代码 start (一个网页只需插入一次) -->


(function() {
    var duoshuoQuery = {short_name:"apirlday"};
    window.duoshuoQuery = duoshuoQuery;
    function start(){
        if(window.ds){
            console.log('reload',window.ds);
            window.location.reload();
        }else{
            var ds = document.createElement('script');
            ds.type = 'text/javascript';
            ds.async = true;
            ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
            ds.charset = 'UTF-8';
            (document.getElementsByTagName('head')[0]|| document.getElementsByTagName('body')[0]).appendChild(ds);
            window.ds = ds;
        }

    }
    module.exports = {
        start:start
    };
})();
<!-- 多说公共JS代码 end -->
