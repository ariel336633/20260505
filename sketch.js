let video;
let faceMesh;
let faces = [];

function preload() {
  // 初始化 FaceMesh 模型，設定最大偵測 1 張臉並開啟影像翻轉
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true });
}

function gotFaces(results) {
  faces = results;
}

function setup() {
  // 建立一個與視窗大小相同的畫布
  createCanvas(windowWidth, windowHeight);
  // 建立攝影機擷取
  // 這裡改用較標準的寫法，鏡像功能由 ml5 處理
  video = createCapture(VIDEO);
  video.hide();
  // 開始偵測臉部
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  // 設定背景顏色為淺藍色
  background(173, 216, 230); // 也可以直接用 'lightblue'
  
  // 在畫布上方顯示文字，左右置中
  fill(0); // 設定文字顏色為黑色
  textSize(32); // 設定字體大小
  textAlign(CENTER, TOP); // 設定水平置中，並對齊文字頂部
  text("教科414730639", width / 2, 40); // 顯示文字，垂直偏移 40 像素以防貼邊
  
  // 計算影像顯示的寬高（畫布的 50%）
  let imgWidth = width * 0.5;
  let imgHeight = height * 0.5;
  
  // 計算置中座標
  let x = (width - imgWidth) / 2;
  let y = (height - imgHeight) / 2;
  
  // 繪製攝影機影像到畫布中間
  image(video, x, y, imgWidth, imgHeight);

  // 5. 繪製臉部偵測點
  // 加上 video.width > 0 判斷是為了確保攝影機啟動後才進行座標計算
  if (faces.length > 0 && video.width > 0) {
    let face = faces[0];
    // 計算縮放比例，確保黃色點位能對齊畫面上 50% 寬高的影像
    let sX = imgWidth / video.width;
    let sY = imgHeight / video.height;

    for (let i = 0; i < face.keypoints.length; i++) {
      let keypoint = face.keypoints[i];
      stroke(255, 255, 0); // 黃色
      strokeWeight(2);
      // 座標轉換：(影像起始座標) + (偵測點 * 縮放比例)
      point(x + keypoint.x * sX, y + keypoint.y * sY);
    }
  }
}

// 確保當視窗大小改變時，畫布也會自動調整
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  console.log(faces);
}
