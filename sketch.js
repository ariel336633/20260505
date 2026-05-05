let video;
let faceMesh;
let faces = [];
let isModelLoaded = false; // 用來追蹤模型是否載入完成

// 將固定陣列移出 draw 函式，避免重複建立以提升效能
const upperLipIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
const lowerLipIndices = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
const faceOutlineIndices = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
const leftEyeIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33];
const rightEyeIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398, 362];
const leftBrowIndices = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46];
const rightBrowIndices = [336, 296, 334, 293, 300, 285, 295, 282, 283, 276];

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

  // 將模型載入移至 setup。這會讓畫布立即顯示，AI 模型在背景載入
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true }, () => {
    isModelLoaded = true; // 模型準備好了
    faceMesh.detectStart(video, gotFaces);
  });
}

function draw() {
  // 設定背景顏色為淺藍色
  background(173, 216, 230); // 也可以直接用 'lightblue'
  
  // 在畫布上方顯示文字，左右置中
  fill(0); // 設定文字顏色為黑色
  textSize(32); // 設定字體大小
  textAlign(CENTER, TOP); // 設定水平置中，並對齊文字頂部
  text("教科414730639", width / 2, 40); // 顯示文字，垂直偏移 40 像素以防貼邊
  
  // 若模型尚未載入，顯示提示文字，提升使用者體驗
  if (!isModelLoaded) {
    fill(255, 0, 0);
    textSize(16);
    text("AI 模型載入中，請稍候...", width / 2, 90);
  }

  // 計算影像顯示的寬高（畫布的 50%）
  let imgWidth = width * 0.5;
  let imgHeight = height * 0.5;
  
  // 計算置中座標
  let x = (width - imgWidth) / 2;
  let y = (height - imgHeight) / 2;
  
  // 4. 繪製攝影機影像到畫布中間，並加上左右翻轉（鏡像）效果
  push();
  // 移動座標中心到影像區域的右邊界，然後水平翻轉座標系
  translate(x + imgWidth, y);
  scale(-1, 1);
  image(video, 0, 0, imgWidth, imgHeight);
  pop();

  // 5. 繪製臉部偵測點
  // 增加 isModelLoaded 判斷
  if (isModelLoaded && faces.length > 0 && video.width > 0) {
    let face = faces[0];
    // 計算縮放比例，確保黃色點位能對齊畫面上 50% 寬高的影像
    let sX = imgWidth / video.width;
    let sY = imgHeight / video.height;

    noFill(); // 確保不填色
    stroke(255, 0, 0); // 設定線條為紅色

    // 1. 繪製第一組線條 (唇部, 粗細 2)
    drawConnectors(face, upperLipIndices, 2, x, y, sX, sY);

    // 2. 繪製第二組線條 (唇部, 粗細 2)
    drawConnectors(face, lowerLipIndices, 2, x, y, sX, sY);

    // 3. 繪製臉部其他部位的線條 (輪廓、眼睛、眉毛, 粗細 2)
    drawConnectors(face, faceOutlineIndices, 2, x, y, sX, sY);
    drawConnectors(face, leftEyeIndices, 2, x, y, sX, sY);
    drawConnectors(face, rightEyeIndices, 2, x, y, sX, sY);
    drawConnectors(face, leftBrowIndices, 2, x, y, sX, sY);
    drawConnectors(face, rightBrowIndices, 2, x, y, sX, sY);
  }
}

// 輔助函式：利用 line 指令串接索引點位
function drawConnectors(face, indices, weight, offsetX, offsetY, scaleX, scaleY) {
  strokeWeight(weight);
  for (let i = 0; i < indices.length - 1; i++) {
    const p1 = face.keypoints[indices[i]];
    const p2 = face.keypoints[indices[i + 1]];
    if (p1 && p2) {
      line(
        offsetX + p1.x * scaleX,
        offsetY + p1.y * scaleY,
        offsetX + p2.x * scaleX,
        offsetY + p2.y * scaleY
      );
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
