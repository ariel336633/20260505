let video;
let faceMesh;
let faces = [];
let isModelLoaded = false; // 用來追蹤模型是否載入完成

// 將固定陣列移出 draw 函式，避免重複建立以提升效能
const upperLipIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
const lowerLipIndices = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];

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

    // 繪製第一組紅色厚線條 (粗細 15)
    stroke(255, 0, 0);
    strokeWeight(15);
    noFill();
    beginShape();
    for (let index of upperLipIndices) {
      let kp = face.keypoints[index];
      if (kp) vertex(x + kp.x * sX, y + kp.y * sY);
    }
    endShape();

    // 繪製第二組紅色細線條 (粗細 1)
    stroke(255, 0, 0);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let index of lowerLipIndices) {
      let kp = face.keypoints[index];
      if (kp) vertex(x + kp.x * sX, y + kp.y * sY);
    }
    endShape();

    // 保留原本的所有偵測點 (黃色小點)
    // if (faces.length > 0 && video.width > 0) {
    //   for (let i = 0; i < face.keypoints.length; i++) {
    //     let keypoint = face.keypoints[i];
    //     stroke(255, 255, 0); 
    //     strokeWeight(2);
    //     point(x + keypoint.x * sX, y + keypoint.y * sY);
    //   }
    // }
  }
}

// 確保當視窗大小改變時，畫布也會自動調整
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  console.log(faces);
}
