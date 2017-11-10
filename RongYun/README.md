# 才盛即使通讯系统CSIM

## 使用步骤
### 1.引入静态资源
css/CSIM_All.css
js/CSIM_All.js

### 2.填写html模板
```
<div ng-controller="main" class="CSIM_UI">
    <h2>当前用户：<span ng-bind="user"></span></h2><br/>
    <label>目标用户Id：</label><input class="input" ng-model="targetId">
    <button class="btn" ng-click="setconversation()"></button><br/> <br/><!--发送消息-->
    <label>目标客服Id：</label><input class="input" ng-model="customerserviceId">
    <button class="btn" ng-click="setcustomerservice()"></button><br/> <br/><!--发起咨询-->
    <rong-widget></rong-widget>
</div>
```
### 3.配置当前用户appkey和token
```
<script>
    /*初始化配置*/
    angular.module('CSIM_Config', ['RongWebIMWidget'])
    .factory('setting', ['WebIMWidget', function () {
        return {
            appkey: '3argexb6r934e',//后端写入appkey
            token: "b/jvjEFD41TIVT0nsf9+L3ryPPkHsvRwWZV8SVI5ICcZ2I5Nl4OdNO01OjZxjjmVlD2dmk4RZ90="//后端写入token
        }
    }]);
</script>
```
### 注意：请保持css、images静态资源文件夹的相对路径不变

## 演示
 同时打开user1.html、user2.html，即可进行通信演示

## 修改记录
 在项目相关js中有添加_time5msg变量，用于测试5分钟未回复则发送短信功能

