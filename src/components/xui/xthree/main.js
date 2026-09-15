/** 
 * 为了方便vue等使用 我们这里换成对象写法、
 */
import * as THREE from "three"
function XThree(el, options) {
  options = options || {}
  const t = this
  const width = el.offsetWidth
  const height = el.offsetHeight
  const asp = width / height

  // scene
  const scene = new THREE.Scene()

  // camera
  let camera
  if (options.camera) {
      camera = options.camera
  } else {
      camera = new THREE.PerspectiveCamera(45, asp, 1, 10000)
      window.addEventListener('resize', function() {
          camera.aspect = el.offsetWidth / el.offsetHeight
          renderer.setSize(el.offsetWidth, el.offsetHeight) // 重新获取
          camera.updateProjectionMatrix()
          renderer.render(scene, camera)
      }, false)
  }
  camera.position.set(30, 30, 30)

  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  el.append(renderer.domElement)
  renderer.setClearColor(options.clearColor || '#000')

  // 辅助
  if (options.axes) scene.add(new THREE.AxesHelper(10))// 坐标轴辅助红x 绿y 蓝z
  if (options.gridHelper) scene.add(new THREE.GridHelper(100, 100))// 网格参考线

  // to the instance
  t.renderer = renderer
  t.scene = scene
  t.camera = camera
  t.el = el
}


/**
* 添加 css2d / css3d renderer
* @param app
* @param cssRender
*/
XThree.prototype.addCssRender = function (app, cssRender) {
  const T = this
  T.config = {}
  T.app = app
  T.el = app.el
  T.init = function () {
      const cssRenderer = new cssRender()
      cssRenderer.setSize( T.el.offsetWidth, T.el.offsetHeight )
      cssRenderer.domElement.style.position = 'absolute'
      cssRenderer.domElement.style.top = 0
      cssRenderer.domElement.style.pointerEvents = "none"
      el.appendChild(cssRenderer.domElement)
      T.cssRenderer = cssRenderer
      T.cssRendererDomElement = cssRenderer.domElement
  }
  T.add = function (option) {
      let list  = []
      if( Array.isArray(option))
          list = option
      else
          list.push(option)
      list.forEach(e => {
          document.body.insertAdjacentHTML('beforeend', e.element)
          const label = new e.cssObject( document.body.lastChild )
          label.position.set(e.position[0], e.position[1], e.position[2])
          label.name = e.name
          if(e.scale) label.scale.set(e.scale[0], e.scale[1], e.scale[2])
          e.parent ? e.parent.add(label) : T.app.scene.add(label)
          T.config[e.name] = label
      })
  }
  T.update = function (name, innerHtml) {
      T.config[name].element.innerHTML = innerHtml
  }
  T.remove = function (name, parent) {
      parent = parent || T.app.scene
      parent.remove(parent.getObjectByName(name))
      // T.config[name].element.remove()
      if(T.config[name]) delete T.config[name]

  }
  T.search = function (name) {
      return  T.config[name]
  }

  T.init()
}
/**
* 初始化OrbitControls控制器
* @param OrbitControls
* @returns {THREE.OrbitControls}
*/
XThree.prototype.initOrbitControls = function(OrbitControls, dom) {
  const controls = OrbitControls ? new OrbitControls(this.camera, dom || this.renderer.domElement) : new THREE.OrbitControls(this.camera, dom || this.renderer.domElement)
  // 如果使用animate方法时，将此函数删除
  // controls.addEventListener( 'change', render );
  // 使动画循环使用时阻尼或自转 意思是否有惯性
  controls.enableDamping = true
  // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
  // controls.dampingFactor = 0.25;
  // 是否可以缩放
  controls.enableZoom = true
  // 是否自动旋转
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.3
  // 设置最大旋转角度
  controls.maxPolarAngle = Math.PI * 0.5;
  // 设置相机距离原点的最远距离
  controls.minDistance = 3
  // 设置相机距离原点的最远距离
  controls.maxDistance = 100;
  // 是否开启右键拖拽
  controls.enablePan = true
  this.controls = controls

  return controls
}

// window.XThree = XThree
export default XThree
