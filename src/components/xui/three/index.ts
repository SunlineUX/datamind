import { App } from 'vue'
import XThree from './XThree.vue'
import XCamera from './XCamera.vue'
import XAmbientLight from './XLights/XAmbientLight.vue'
import XDirectionalLight from './XLights/XDirectionalLight.vue'
import XPointLight from './XLights/XPointLight.vue'
import XSpotLight from './XLights/XSpotLight.vue'
import XHemisphereLight from './XLights/XHemisphereLight.vue'
import XMesh from './XMesh.vue'
import XBoxGeometry from './XGeometries/XBoxGeometry.vue'
import XSphereGeometry from './XGeometries/XSphereGeometry.vue'
import XCylinderGeometry from './XGeometries/XCylinderGeometry.vue'
import XPlaneGeometry from './XGeometries/XPlaneGeometry.vue'
import XMeshBasicMaterial from './XMaterials/XMeshBasicMaterial.vue'
import XMeshStandardMaterial from './XMaterials/XMeshStandardMaterial.vue'
import XMeshLambertMaterial from './XMaterials/XMeshLambertMaterial.vue'
import XGridHelper from './XHelpers/XGridHelper.vue'
import XAxisHelper from './XHelpers/XAxisHelper.vue'
import XOrbitControls from './XControls/XOrbitControls.vue'

const components = {
  XThree,
  XCamera,
  XAmbientLight,
  XDirectionalLight,
  XPointLight,
  XSpotLight,
  XHemisphereLight,
  XMesh,
  XBoxGeometry,
  XSphereGeometry,
  XCylinderGeometry,
  XPlaneGeometry,
  XMeshBasicMaterial,
  XMeshStandardMaterial,
  XMeshLambertMaterial,
  XGridHelper,
  XAxisHelper,
  XOrbitControls
}

export default {
  install(app: App) {
    Object.keys(components).forEach(key => {
      app.component(key, components[key as keyof typeof components])
    })
  }
}

export {
  XThree,
  XCamera,
  XAmbientLight,
  XDirectionalLight,
  XPointLight,
  XSpotLight,
  XHemisphereLight,
  XMesh,
  XBoxGeometry,
  XSphereGeometry,
  XCylinderGeometry,
  XPlaneGeometry,
  XMeshBasicMaterial,
  XMeshStandardMaterial,
  XMeshLambertMaterial,
  XGridHelper,
  XAxisHelper,
  XOrbitControls
}
