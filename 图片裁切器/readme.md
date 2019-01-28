h5有一款教好的截图插件，源码和demo详见 https://github.com/fengyuanchen/cropper

图片裁切器接口
普通版(注意接口要支持get和post)
  图片上传：
    请求：http:www.597.com/ImgService?zoomScale=100&saveDir=album/photo&oriImg=1
          zoomScale 图片缩放比例
          saveDir   存储目录
          oriImg    1为未压缩原图 0为压缩原图
    响应：
    {
      flag:"true",
      result:[{ori:"http:www.597.com/test.jpg"}]
     } 
  图片裁切：
    请求：http:www.597.com/ImgCutService?imgUrl=http:www.597.com/test.jpg&x=10&y=10&width=100&height=100
          imgUrl 目标裁切图片url
          x     裁切x坐标
          y     裁切y坐标
          width 裁切宽度 
          height裁切高度
    响应：
    {
      flag:"true",
      result:[{ori:"http:www.597.com/test.jpg",cuted:"http:www.597.com/tested.jpg"}]
     } 
