
$(document).ready(function(){
    var setting = {view:{selectedMulti:false},data:{simpleData:{enable:true}}};
    var zNodes=[
        {id:'2', pId:'1', name:"组织机构", url:"/jeesite/a/cms/article/?category.id=2", target:"cmsMainFrame"},
        {id:'10', pId:'1', name:"软件介绍", url:"/jeesite/a/cms/article/?category.id=10", target:"cmsMainFrame"},
        {id:'6', pId:'1', name:"质量检验", url:"/jeesite/a/cms/article/?category.id=6", target:"cmsMainFrame"},
        {id:'11', pId:'10', name:"网络工具", url:"/jeesite/a/cms/article/?category.id=11", target:"cmsMainFrame"},
        {id:'3', pId:'2', name:"网站简介", url:"/jeesite/a/cms/article/?category.id=3", target:"cmsMainFrame"},
        {id:'7', pId:'6', name:"产品质量", url:"/jeesite/a/cms/article/?category.id=7", target:"cmsMainFrame"},
        {id:'12', pId:'10', name:"浏览工具", url:"/jeesite/a/cms/article/?category.id=12", target:"cmsMainFrame"},
        {id:'4', pId:'2', name:"内部机构", url:"/jeesite/a/cms/article/?category.id=4", target:"cmsMainFrame"},
        {id:'8', pId:'6', name:"技术质量", url:"/jeesite/a/cms/article/?category.id=8", target:"cmsMainFrame"},
        {id:'13', pId:'10', name:"浏览辅助", url:"/jeesite/a/cms/article/?category.id=13", target:"cmsMainFrame"},
        {id:'14', pId:'10', name:"网络优化", url:"/jeesite/a/cms/article/?category.id=14", target:"cmsMainFrame"},
        {id:'15', pId:'10', name:"邮件处理", url:"/jeesite/a/cms/article/?category.id=15", target:"cmsMainFrame"},
        {id:'16', pId:'10', name:"下载工具", url:"/jeesite/a/cms/article/?category.id=16", target:"cmsMainFrame"},
        {id:'17', pId:'10', name:"搜索工具", url:"/jeesite/a/cms/article/?category.id=17", target:"cmsMainFrame"},
        {id:'19', pId:'18', name:"常用网站", url:"/jeesite/a/cms/link/?category.id=19", target:"cmsMainFrame"},
        {id:'20', pId:'18', name:"门户网站", url:"/jeesite/a/cms/link/?category.id=20", target:"cmsMainFrame"},
        {id:'21', pId:'18', name:"购物网站", url:"/jeesite/a/cms/link/?category.id=21", target:"cmsMainFrame"},
        {id:'22', pId:'18', name:"交友社区", url:"/jeesite/a/cms/link/?category.id=22", target:"cmsMainFrame"},
        {id:'23', pId:'18', name:"音乐视频", url:"/jeesite/a/cms/link/?category.id=23", target:"cmsMainFrame"},
        {id:'5', pId:'2', name:"地方机构", url:"/jeesite/a/cms/article/?category.id=5", target:"cmsMainFrame"},
        {id:'9', pId:'6', name:"工程质量", url:"/jeesite/a/cms/article/?category.id=9", target:"cmsMainFrame"},
        {id:'18', pId:'1', name:"友情链接", url:"/jeesite/a/cms/link/?category.id=18", target:"cmsMainFrame"},
        {id:'24', pId:'1', name:"百度一下", url:"/jeesite/a/cms/none/?category.id=24", target:"cmsMainFrame"},
        {id:'25', pId:'1', name:"全文检索", url:"/jeesite/a/cms/none/?category.id=25", target:"cmsMainFrame"},
        {id:'27', pId:'1', name:"公共留言", url:"/jeesite/a/cms/none/?category.id=27", target:"cmsMainFrame"},
    ];
    for(var i=0; i<zNodes.length; i++) {
        // 移除父节点
        if (zNodes[i] && zNodes[i].id == 1){
            zNodes.splice(i, 1);
        }
    }
    // 初始化树结构
    var tree = $.fn.zTree.init($("#tree"), setting, zNodes);
    // 展开第一级节点
    var nodes = tree.getNodesByParam("level", 0);
    for(var i=0; i<nodes.length; i++) {
        tree.expandNode(nodes[i], true, true, false);
    }
    // 展开第二级节点
    nodes = tree.getNodesByParam("level", 1);
    for(var i=0; i<nodes.length; i++) {
        tree.expandNode(nodes[i], true, true, false);
    }
    wSize();
});
$(window).resize(function(){
    wSize();
});
function wSize(){
    $(".ztree").width($(window).width()-16).height($(window).height()-62);
    $(".ztree").css({"overflow":"auto","overflow-x":"auto","overflow-y":"auto"});
    $("html,body").css({"overflow":"hidden","overflow-x":"hidden","overflow-y":"hidden"});
}
	