let capture;

function setup() {
  // 建立一個與視窗大小相同的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 建立攝影機擷取
  capture = createCapture(VIDEO);
  
  // 隱藏預設產生的 HTML5 video 元件，只在畫布上繪製
  capture.hide();
}

function draw() {
  // 設定背景顏色為淺藍色
  background(173, 216, 230); // 也可以直接用 'lightblue'
  
  // 計算影像顯示的寬高（畫布的 50%）
  let imgWidth = width * 0.5;
  let imgHeight = height * 0.5;
  
  // 計算置中座標
  let x = (width - imgWidth) / 2;
  let y = (height - imgHeight) / 2;
  
  // 繪製攝影機影像到畫布中間，並加上左右翻轉（鏡像）效果
  push();
  // 移動座標系統到影像右邊邊界，然後縮放 -1 倍達成水平翻轉
  translate(x + imgWidth, y);
  scale(-1, 1);
  image(capture, 0, 0, imgWidth, imgHeight);
  pop();
}

// 確保當視窗大小改變時，畫布也會自動調整
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
