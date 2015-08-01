// 定义处理方法
var sepia = function(el){
  var canvas = document.createElement('canvas');
  var w = canvas.width = el.offsetWidth,
        h = canvas.height = el.offsetHeight;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(el, 0, 0);
  
  // 对像素作处理
  var imgData = ctx.getImageData(0, 0, w, h), d = imgData.data;
  for (int i = 0, len = d.length; i < len; i+=4){
    var r = d[i],
         g = d[i+1],
         b = d[i+2];
    d[i] = (r * 0.393)+(g * 0.769)+(b * 0.189);
    d[i+1] = (r * 0.349)+(g * 0.686)+(b * 0.168);
    d[i+2] = (r * 0.272)+(g * 0.534)+(b * 0.131);
  }
  ctx.putImageData(imgData, 0, 0);

  // 导出
  var img = new Image();
  img.src = ctx.toDataURL("image/*");
  return img;
};

// 调用
var img = sepia(document.getElementById('sepia'));
document.body.appendChild(img);