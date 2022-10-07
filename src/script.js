import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RedFormat } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const startTexture = textureLoader.load('./textures/particles/8.png')
/**
 * Custom buffer gemoetry
 */
 const randomGeometry = new THREE.BufferGeometry();

let randomVerticesPositions = []
const expandLimit = 10
const particlesCount = 5000

for (let i = 0; i < particlesCount * 3; i++){
    randomVerticesPositions.push((Math.random()-0.5) * expandLimit)
}

let randomVertices = new Float32Array(randomVerticesPositions)

 // itemSize = 3 because there are 3 values (components) per vertex
randomGeometry.setAttribute( 'position', new THREE.BufferAttribute( randomVertices, 3 ) );

// Random color
const colorsCount = 5000
const colorValuesArray = new Float32Array(colorsCount * 3)
for (let i = 0; i < colorsCount * 3; i++){
    colorValuesArray[i] = Math.floor(Math.random()*10 + 5)/10 
}
randomGeometry.setAttribute('color', new THREE.BufferAttribute(colorValuesArray, 3))

/**
 * Particles
 */

//Material
const particlesMaterial = new THREE.PointsMaterial({
    color: "#fff",
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: startTexture,
    // Alpha test, depth test, and depth write are possible fixes to the non-transparent alpha bug
    // alphaTest: 0.05, // ramps the white/black range
    // depthTest: false, // related to GPU drawing order
    depthWrite: false, // helps when there are other objects in the scene, far particles will not render in front of the particles
    // Additive blending, well... makes the blending additive
    blending : THREE.AdditiveBlending, // Use carefully, it's expensive on resources
    vertexColors: true
})

//Points
const particles = new THREE.Points(randomGeometry, particlesMaterial)

scene.add(particles)

// Testing Cube
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial({color: 0xff00aa})
// )
// scene.add(cube)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update partilces container object
    particles.rotation.y = elapsedTime * .05
    particles.rotation.z = Math.sin(elapsedTime * 0.1) * Math.cos(elapsedTime * 0.1)

    //Update particles

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()