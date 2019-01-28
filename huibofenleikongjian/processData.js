var data=null;
$.ajax({
    // url:'/huibofenleikongjian/data.js',
    url:'jobclass.api.js',
    async:false,
    success:function (result) {
        data=result;
        console.log(data);
        console.log('数据请求成功');
    }
});
