var camera, clock, scene, renderer, composer, stats;
wait()

var tank, key, physics;

var camera_offset;

function wait() {
    if (typeof THREE === "undefined") { requestAnimationFrame(wait) } else { start() }
}

function start() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x333333)

    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.updateProjectionMatrix()
    camera.position.z = 5
    camera.position.y = 3

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace


    controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    document.body.appendChild(renderer.domElement);


    clock = new THREE.Clock()

    setupEventHandlers()

    ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(0xffffff, 5)
    dirLight.position.set(0, 2, 5)
    scene.add(dirLight)

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    stats = new Stats()
    document.body.appendChild(stats.dom)

    physics = new Physics()

    update()
}


function update() {
    requestAnimationFrame(update)
    physics.update(clock)
    stats.update()
    renderer.render(scene, camera);
    composer.render();
}


function handleKeyDown(event) {

    let keyCode = event.keyCode;

    //console.log(keyCode)


    switch (keyCode) {
        case 87: //W: FORWARD
            for (let i = 0; i < physics.vehicle.wheelInfos.length; i++) {
                physics.vehicle.applyEngineForce(30, i)
            }
            break;

        case 83: //S: BACK
            for (let i = 0; i < physics.vehicle.wheelInfos.length; i++) {
                physics.vehicle.applyEngineForce(-30, i)
            }
            break;

        case 65: //A: LEFT
            for (let i = 0; i < physics.vehicle.wheelInfos.length / 2; i++) {
                physics.vehicle.applyEngineForce(-200, i)
            }
            for (let i = physics.vehicle.wheelInfos.length / 2; i < physics.vehicle.wheelInfos.length; i++) {
                physics.vehicle.applyEngineForce(200, i)
            }
            break;

        case 68: //D: RIGHT
            for (let i = 0; i < physics.vehicle.wheelInfos.length / 2; i++) {
                physics.vehicle.applyEngineForce(200, i)
            }
            for (let i = physics.vehicle.wheelInfos.length / 2; i < physics.vehicle.wheelInfos.length; i++) {
                physics.vehicle.applyEngineForce(-200, i)
            }
            break;

        case 66: //D: RIGHT
            for (let i = 0; i < physics.vehicle.wheelInfos.length; i++) {
                physics.vehicle.setBrake(1, i)
            }
            break;
    }
}

function handleKeyUp(event) {

    let keyCode = event.keyCode;

    switch (keyCode) {
        case 87: //FORWARD
            for (let i = 0; i < physics.vehicle.wheelInfos.length; i++) {
                physics.vehicle.applyEngineForce(0, i)
            }
            break;

        case 83: //BACK
            for (let i = 0; i < physics.vehicle.wheelInfos.length; i++) {
                physics.vehicle.applyEngineForce(0, i)
            }
            break;

        case 65: //LEFT
            for (let i = 0; i < physics.vehicle.wheelInfos.length; i++) {
                physics.vehicle.applyEngineForce(0, i)
            }
            break;

        case 68: //RIGHT
            for (let i = 0; i < physics.vehicle.wheelInfos.length; i++) {
                physics.vehicle.applyEngineForce(0, i)
            }
            break;

        case 66: //D: RIGHT
            for (let i = 0; i < physics.vehicle.wheelInfos.length; i++) {
                physics.vehicle.setBrake(0, i)
            }
            break;

    }

}

function setupEventHandlers() {
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
}


function windowResized() {
    resizeCanvas3D(windowWidth, windowHeight);
}

