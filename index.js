const overplay = document.getElementById('overplay')
const loading = document.getElementById('loading')
const clock = new THREE.Clock();
startButton.addEventListener('click', start)
$('.example1').typeIt({
  whatToType: "press E to light or R to close door",
  typeSpeed: 50,
}, () => { });
// 初始化设置
let renderer, camera, scene, light, control, gltf, spotLight, spotLight_, ambient, pos = new THREE.Vector3(-100, 8, 0)
// 玩家互动
let left, center, right, buttom, back, spotlight = false, closedoor = false
// 屏幕宽高相对
let width, height
// 预备量
let pre_left = false, pre_right = false, pre_center = false, pre_buttom = false
// 动画
let font_left_door, font_right_door, left_door, right_door
// 声音
let wooddooropen, wooddoorclose, walkdooraudio, turnonoffaudio, aaaopendoor, aaaclosedoor, mobclose
// 鬼位置
let mob_position = ["mob_left", "mob_center", "mob_right", "mob_buttom"], mob_position_
// 鬼情况
let mob_live = false
function start() {
  startButton.innerHTML = '加载中...'
  loading.style.display = 'block'
  document.querySelector("#time").style.display = 'block'
  initAudio()
  initRenderer()
  initScene()
  initCamera()
  initLight()
  loadModel()
  controler()
  load()
  // 玩法
  time_change()
  dotmouseover()
  mob_create_in_time()
  render()
}
function render() {
  renderer.render(scene, camera)
  TWEEN.update();
  spotLight.position.copy(camera.position)
  spotLight_.position.copy(camera.position)
  camera.lookAt(pos);
  requestAnimationFrame(render)
}
function initRenderer() {
  renderer = new THREE.WebGLRenderer()
  width = window.innerWidth
  height = window.innerHeight
  renderer.setSize(width, height)
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMapSoft = true;
  renderer.shadowMapAutoUpdate = true;
  renderer.sortObjects = false;
  renderer.localClippingEnabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.toneMappingWhitePoint = 1.0;
  renderer.physicallyCorrectLights = true;
  renderer.setClearColor(0x000089, 1.0)
  document.body.appendChild(renderer.domElement)
}
function initScene() {
  scene = new THREE.Scene()
}
function initCamera() {
  camera = new THREE.PerspectiveCamera(70, width / height, 1, 3000)
  camera.updateProjectionMatrix();
}
function initLight() {
  spotLight = new THREE.SpotLight(0xffffff, 1.0);
  spotLight.decay = 0.9;
  spotLight.intensity = 11;
  spotLight.angle = Math.PI / 6;
  spotLight.target.position.set(-100, 8, 0)
  spotLight.position.set(-2, 6, -1.2)
  scene.add(spotLight.target)
  scene.add(spotLight);
  spotLight_ = new THREE.SpotLight(0xffffff, 1.0);
  spotLight_.decay = 1;
  spotLight_.intensity = 3;
  spotLight_.angle = Math.PI / 5.8;
  spotLight_.target.position.set(-100, 8, 0)
  spotLight_.position.set(-2, 6, -1.2)
  scene.add(spotLight_.target)
  scene.add(spotLight_);
  ambient = new THREE.AmbientLight(0xffffff, 0.06);
  scene.add(ambient);
}

function loadModel() {
  const loader = new THREE.GLTFLoader()
  loader.load('./bedroom.gltf', (gltf) => {
    gltf.scene.scale.set(0.8, 0.8, 0.8)
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true
        child.castShadow = true
      }
    });
    scene.add(gltf.scene)
    const mixer = new THREE.AnimationMixer(gltf.scene)
    // 指定动画名称
    font_left_door = mixer.clipAction(gltf.animations[0]);
    font_right_door = mixer.clipAction(gltf.animations[1]);
    left_door = mixer.clipAction(gltf.animations[2]);
    right_door = mixer.clipAction(gltf.animations[3]);
    for (var i = 0; i < gltf.animations.length; i++) {
      mixer.clipAction(gltf.animations[i]).loop = THREE.LoopOnce;
      mixer.clipAction(gltf.animations[i]).clampWhenFinished = true;
      mixer.clipAction(gltf.animations[i]).timeScale = 1.2
    }
    function loop() {
      requestAnimationFrame(loop);
      const frameT = clock.getDelta();
      mixer.update(frameT);
    }
    loop();
  })
}
function controler() {
  control = new THREE.OrbitControls(camera, renderer.domElement)
  control.enableZoom = false
  control.enablePan = false
  window.addEventListener('resize', onWindowResize)
}
function onWindowResize() {
  camera.aspect = window.innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
function initAudio() {
  walkdooraudio = new Audio()
  walkdooraudio.src = "./walkdoor.aac"
  turnonoffaudio = new Audio()
  turnonoffaudio.src = "./turnonoff.wav"
  wooddooropen = new Audio()
  wooddooropen.src = "./woorddooropen.mp3"
  wooddoorclose = new Audio()
  wooddoorclose.src = "./wooddoorclose.mp3"
  aaaclosedoor = new Audio()
  aaaclosedoor.src = "./aaaclosedoor.mp3"
  aaaopendoor = new Audio()
  aaaopendoor.src = "./Audio/aaaopendoor.mp3"
  mobclose = new Audio()
  mobclose.src = "./mobclose.wav"
  let listener = new THREE.AudioListener()
  let audio = new THREE.Audio(listener)
  let audioLoader = new THREE.AudioLoader()
  audioLoader.load('./backgroundmusic.aac', (AudioBuffer) => {
    audio.setBuffer(AudioBuffer)
    audio.setVolume(0.8)
    audio.play()
  })
}
function displayblock() {
  left.style.display = 'block'
  center.style.display = 'block'
  right.style.display = 'block'
  buttom.style.display = 'block'
}
function displaynone() {
  left.style.display = 'none'
  center.style.display = 'none'
  right.style.display = 'none'
  buttom.style.display = 'none'
}
function load() {
  left = document.querySelector("#left")
  center = document.querySelector("#center")
  right = document.querySelector("#right")
  buttom = document.querySelector("#buttom")
  overplay.remove()
  loading.remove()
  function CHUSHIHUA() {
    camera.position.set(-2, 6, -1.2)
    setTimeout(() => {
      displayblock()
    }, 1000);
    document.removeEventListener("click", CHUSHIHUA)
  }
  document.addEventListener("click", CHUSHIHUA)
  // 摄像头上下缓动
  setInterval(() => {
    tweenposturn(pos.x, pos.y + 0.3, pos.z, 200)
    setTimeout(() => {
      tweenposturn(pos.x, pos.y - 0.3, pos.z, 200)
    }, 1000);
  }, 10000);
}
function dotmouseover() {
  left.onmouseover = function () {
    leftreact()
    movetodoor(pre_left, left, -2, 6, 20, 1000)
  }
  center.onmouseover = function () {
    centerreact()
    movetodoor(pre_center, center, -23, 6, -1.2, 1000)
  }
  right.onmouseover = function () {
    rightreact()
    movetodoor(pre_right, right, -2, 6, -20, 1000)
  }
  buttom.onmouseover = function () {
    buttomreact()
  }
}
function react_false() {
  pre_left = false
  pre_center = false
  pre_right = false
  pre_buttom = false
}
function leftreact() {
  tweenlighttarget(-2, 6, 16, 500)
  tweenposturn(-2, 6, 16, 300)
  react_false()
  pre_left = true
  kokotaqi = { x: -10, y: 6, z: 25, time: 1000 }
}
function centerreact() {
  tweenlighttarget(-100, 6, 0, 500)
  tweenposturn(-100, 6, 0, 300)
  react_false()
  pre_center = true
  kokotaqi = { x: -23.5, y: 5.7, z: -1.2, time: 1000 }
}
function rightreact() {
  tweenlighttarget(-2, 6, -16, 500)
  tweenposturn(-2, 6, -16, 300)
  react_false()
  pre_right = true
  kokotaqi = { x: -10, y: 6, z: -25, time: 1000 }
}
function buttomreact() {
  tweenlighttarget(20, 6, 0, 500)
  tweenposturn(20, 6, 0, 300)
  react_false()
  pre_buttom = true
}
function tweenlighttarget(x, y, z, time) {
  const tween = new TWEEN.Tween(spotLight.target.position)
  tween.to({ x: x, y: y, z: z }, time)
  tween.start()
  const tween_ = new TWEEN.Tween(spotLight_.target.position)
  tween_.to({ x: x, y: y, z: z }, time)
  tween_.start()
}
function tweenposturn(x, y, z, time) {
  const tween = new TWEEN.Tween(pos)
  tween.to({ x: x, y: y, z: z }, time)
  tween.start()
}
function tweencameraposition(x, y, z, time, which) {
  const tween = new TWEEN.Tween(camera.position)
  tween.to({ x: x, y: y, z: z }, time)
  tween.start()
  which.removeEventListener("click", tweencameraposition)
  if (back) {
    setTimeout(() => {
      light = true
      closedoor = true
      document.addEventListener("click", backbed)
      document.addEventListener("keydown", keypress)
      document.addEventListener("keyup", keyup)
    }, 1000);
  }
}
function keypress(e) {
  if (e.key === 'e') { if (light) { light_() } }
  if (e.key === 'r') { if (closedoor) { closedoor_() } }
}
function keyup(e) {
  if (e.key === 'e') {
    light_i = 0
    spotLight.intensity = '0.11'
    spotLight_.intensity = '0.03'
    closedoor = true
  }
  if (e.key === 'r') {
    // 前门
    light = true
    closedoor_i = 0
    if (pre_center) {
      font_left_door.stop()
      font_right_door.stop()
      wooddooropen.play()
    }
    if (pre_left || pre_right) {
      aaaopendoor.play()
    }
    if (pre_left) {
      left_door.stop()
    }
    if (right_door) {
      right_door.stop()
    }
  }
}
function light_() {
  if (light_i === 0) { turnonoffaudio.play() }
  light_i++
  spotLight.intensity = '11'
  spotLight_.intensity = '3'
  closedoor = false
}
let closedoor_i = 0
let light_i = 0
function closedoor_() {
  if (pre_center) {
    font_left_door.play();
    font_right_door.play();
    if (closedoor_i == 0) {
      setTimeout(() => {
        wooddoorclose.play()
      }, 200);
    }
  }
  if (pre_left || pre_right) {
    if (closedoor_i == 0) {
      setTimeout(() => {
        aaaclosedoor.play()
      }, 200);
    }
  }
  if (pre_left) {
    left_door.play()
  }
  if (pre_right) {
    right_door.play()
  }
  closedoor_i++
  light = false
}
function tweencameraposition_(x, y, z, time) {
  const tween = new TWEEN.Tween(camera.position)
  tween.to({ x: x, y: y, z: z }, time)
  tween.start()
}
function tweenlight(intensity, time, which) {
  const light_tween = new TWEEN.Tween(which)
  light_tween.to({ intensity: intensity }, time)
  light_tween.start()
}
function movetodoor(which, which_, x, y, z, time) {
  if (which) {
    which_.addEventListener("click", function () {
      walkdooraudio.play()
      tweenposturn(kokotaqi.x, kokotaqi.y, kokotaqi.z, kokotaqi.time)
      tweenlighttarget(kokotaqi.x, kokotaqi.y, kokotaqi.z, kokotaqi.time)
      back = true
      tweencameraposition(x, y, z, time, which_)
      displaynone()
      tweenlight(0.11, 200, spotLight)
      tweenlight(0.03, 200, spotLight_)
    })
  }
}
function backbed() {
  walkdooraudio.play()
  back = false
  pre_left = false
  pre_center = false
  pre_right = false
  pre_buttom = false
  tweenlighttarget(-100, 6, 0, 500)
  tweenposturn(-100, 6, 0, 300)
  tweencameraposition_(-2, 6, -1.2)
  tweenlight(11, 1000, spotLight)
  tweenlight(3, 1000, spotLight_)
  font_left_door.stop()
  font_right_door.stop()
  left_door.stop()
  right_door.stop()
  setTimeout(() => {
    displayblock()
  }, 1000);
  document.removeEventListener("click", backbed)
  document.removeEventListener("keydown", keypress)
  document.removeEventListener("keyup", keyup)
}
document.addEventListener("keydown", function (e) {
  if (e.key === 'o') {
    mob_light()
    console.log("----------\n测试\n----------")
  }
})
// 下面是有关怪物元素的
// 鬼闪灯
function mob_light() {
  const mob_light_times = setInterval(() => {
    scene.remove(ambient)
    if (pre_center || pre_buttom) {
      spotLight.intensity = 0.11
      spotLight_.intensity = 0.03
    }
    setTimeout(() => {
      scene.add(ambient)
      if (pre_center || pre_buttom) {
        spotLight.intensity = 11
        spotLight_.intensity = 3
      }
    }, Math.random() * 100);
  }, Math.random() * 100);
  setTimeout(() => {
    clearInterval(mob_light_times)
  }, 1000);
}
// 鬼生成函数
function mob_create_in_time() {
  // 四处可以生成鬼
  // 等音乐结束生成函数
  setTimeout(() => {
    setInterval(() => {
      if (!mob_live) {
        mob_create()
        mobclose.play()
        mobclose.volume = "0.2"
      }
    }, 1000);
  }, 57000);
}
function mob_create() {
  setTimeout(() => {
    mob_live = true
    var mob_i = Math.floor(Math.random() * 4)
    mob_position_ = mob_position(mob_i)
  }, 5000 + Math.random() * 10000);
}
let time_i = 0
// 设置时间
function time_set() {
  document.querySelector("#time").innerHTML = "<span>Night:1</span><span><br><br>" + time_i + ":00AM</span>"
}
// 更改时间
function time_change() {
  time_set()
  setInterval(() => {
    time_i += 1
    time_set()
  }, 90000);
}