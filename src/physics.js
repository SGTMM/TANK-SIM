class Physics {
    constructor() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
        })
        this.world.broadphase = new CANNON.SAPBroadphase(this.world)
        //this.world.defaultContactMaterial.friction = 0
        this.cannonRenderer = new CannonDebugRenderer(scene, this.world)
        /*
                this.plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide }))
                this.plane.scale.set(10, 10, 10)
                scene.add(this.plane)
                this.plane.userData.body = new CANNON.Body({
                    mass: 0,
                    shape: new CANNON.Plane(),
                })
                this.plane.userData.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
                this.world.addBody(this.plane.userData.body) */
        this.loader = new GLTFLoader()

        /* this.loader.load("low_poly_city.glb", (obj) => {
            this.city = obj.scene
            this.city.traverse((e) => {
                if (e.isMesh) {
                    this.CannonGeometry = new THREE.BufferGeometry().copy(e.geometry).applyQuaternion(e.getWorldQuaternion(new THREE.Quaternion())).translate(e.getWorldPosition(new THREE.Vector3()))
                    this.bvh = new MeshBVH(this.CannonGeometry)
                    this.bvhHelper = new MeshBVHHelper(this.bvh, 10)
                    scene.add(this.bvhHelper)
                    var points = []
                    for (let i = 0; i < this.CannonGeometry.attributes.position.array.length; i += 3) {
                        points.push(
                            new THREE.Vector3(this.CannonGeometry.attributes.position.array[i], this.CannonGeometry.attributes.position.array[i + 1], this.CannonGeometry.attributes.position.array[i + 2])
                        )
                    }
                    var convexGeometry = new ConvexGeometry(points)
                    this.shape = CannonUtils.CreateConvexPolyhedron(convexGeometry)
                    this.collider = new CANNON.Body({
                        mass: 0,
                        shape: this.shape
                    })
                    //this.collider.position = new CANNON.Vec3(e.getWorldPosition(new THREE.Vector3()).x, e.getWorldPosition(new THREE.Vector3()).y, e.getWorldPosition(new THREE.Vector3()).z)
                    //this.collider.quaternion = e.getWorldQuaternion(new THREE.Quaternion())
                    e.userData.body = this.collider
                    physics.world.addBody(e.userData.body)
                }
            })
            //scene.add(this.city)
            this.sphere = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial({ color: 0xff00ff }))
            scene.add(this.sphere)
            this.sphere.userData.body = new CANNON.Body({
                mass: 0.5,
                shape: new CANNON.Sphere(1),
            })
            this.sphere.userData.body.position.set(0, 50, 0)
            this.world.addBody(this.sphere.userData.body) 
        }) */

        this.loader.load("tank6.glb", (obj) => {
            this.tank = obj.scene
            this.colliderShape = this.tank.children[0].children[0]
            this.colliderShape.visible = false
            this.CannonGeometry = new THREE.BufferGeometry().copy(this.colliderShape.geometry).applyQuaternion(this.colliderShape.getWorldQuaternion(new THREE.Quaternion())).scale(this.colliderShape.scale.x, this.colliderShape.scale.y, this.colliderShape.scale.z).rotateY(Math.PI / 2).translate(this.colliderShape.getWorldPosition(new THREE.Vector3()))
            var points = []
            for (let i = 0; i < this.CannonGeometry.attributes.position.array.length; i += 3) {
                points.push(
                    new THREE.Vector3(this.CannonGeometry.attributes.position.array[i], this.CannonGeometry.attributes.position.array[i + 1], this.CannonGeometry.attributes.position.array[i + 2])
                )
            }
            var convexGeometry = new ConvexGeometry(points)
            this.shape = CannonUtils.CreateConvexPolyhedron(convexGeometry)
            this.collider = new CANNON.Body({
                mass: 170,
                shape: this.shape,
            })

            this.vehicle = new CANNON.RaycastVehicle({
                chassisBody: this.collider
            })

            const wheelOptions = {
                radius: 0.15,
                directionLocal: new CANNON.Vec3(0, -1, 0),
                suspensionStiffness: 30,
                suspensionRestLength: 0.3,
                frictionSlip: 1.4,
                dampingRelaxation: 2.3,
                dampingCompression: 4.4,
                maxSuspensionForce: 100000,
                rollInfluence: 0.01,
                axleLocal: new CANNON.Vec3(0, 0, 1),
                chassisConnectionPointLocal: new CANNON.Vec3(-0.5, 0.5, 1),
                maxSuspensionTravel: 0.3,
                customSlidingRotationalSpeed: -30,
                useCustomSlidingRotationalSpeed: true,
            }

            //LEFT FRONT
            wheelOptions.chassisConnectionPointLocal.set(1, 0.6, -0.45)
            this.vehicle.addWheel(wheelOptions)
            //LEFT BACK
            wheelOptions.chassisConnectionPointLocal.set(-0.9, 0.55, -0.45)
            this.vehicle.addWheel(wheelOptions)

            wheelOptions.chassisConnectionPointLocal.set(-0.55, 0.4, -0.45)
            this.vehicle.addWheel(wheelOptions)

            wheelOptions.chassisConnectionPointLocal.set(-0.15, 0.4, -0.45)
            this.vehicle.addWheel(wheelOptions)

            wheelOptions.chassisConnectionPointLocal.set(0.25, 0.4, -0.45)
            this.vehicle.addWheel(wheelOptions)

            wheelOptions.chassisConnectionPointLocal.set(0.65, 0.4, -0.45)
            this.vehicle.addWheel(wheelOptions)

            //RIGHT FRONT
            wheelOptions.chassisConnectionPointLocal.set(1, 0.6, 0.45)
            this.vehicle.addWheel(wheelOptions)
            //RIGHT BACK
            wheelOptions.chassisConnectionPointLocal.set(-0.9, 0.55, 0.45)
            this.vehicle.addWheel(wheelOptions)

            wheelOptions.chassisConnectionPointLocal.set(-0.55, 0.4, 0.45)
            this.vehicle.addWheel(wheelOptions)

            wheelOptions.chassisConnectionPointLocal.set(-0.15, 0.4, 0.45)
            this.vehicle.addWheel(wheelOptions)

            wheelOptions.chassisConnectionPointLocal.set(0.25, 0.4, 0.45)
            this.vehicle.addWheel(wheelOptions)

            wheelOptions.chassisConnectionPointLocal.set(0.65, 0.4, 0.45)
            this.vehicle.addWheel(wheelOptions)

            this.vehicle.addToWorld(this.world)

            // Add the wheel bodies
            this.wheelBodies = []
            this.wheelMaterial = new CANNON.Material('wheel')
            this.vehicle.wheelInfos.forEach((wheel) => {
                const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 1.25, 20)
                const wheelBody = new CANNON.Body({
                    mass: 0,
                    material: this.wheelMaterial,
                })
                wheelBody.type = CANNON.Body.KINEMATIC
                wheelBody.collisionFilterGroup = 0 // turn off collisions
                const quaternion = new CANNON.Quaternion().setFromEuler(0, Math.PI / 2, Math.PI / 2)
                wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion)
                this.wheelBodies.push(wheelBody)
                this.world.addBody(wheelBody)
            })

            this.collider.position.y = 2
            this.tank.userData.body = this.collider
            physics.world.addBody(this.tank.userData.body)
            scene.add(this.tank)

            this.loader.load("ground.glb", (obj) => {
                this.ground = obj.scene
                this.colliderShape2 = this.ground.children[0]
                this.helper = new THREE.BoxHelper(this.colliderShape2, 0xff0000);
                this.helper.update();
                scene.add(this.helper);
                var box3 = new THREE.Box3();
                var size = new THREE.Vector3();
                box3.setFromObject(this.helper); // or from mesh, same answer
                var points = [];
                var precision = 3;
                var maxHeight = 2
                var sectionsX = this.Subdivide(box3.max.x, box3.min.x, 1 / precision)
                var sectionsZ = this.Subdivide(box3.max.z, box3.min.z, 1 / precision)
                var offsetX = 1 / precision;
                var offsetZ = 1 / precision;
                const raycaster = new THREE.Raycaster();
                for (var x = 1; x <= sectionsX; x++) {
                    points.push([])
                    for (var z = 1; z <= sectionsZ; z++) {
                        raycaster.set(new THREE.Vector3(box3.max.x - offsetX, maxHeight, box3.max.z - offsetZ), new THREE.Vector3(0, -1, 0))
                        var intersect = raycaster.intersectObjects(this.ground.children);
                        if (typeof intersect[0] === "undefined") {
                            var height = 0
                        } else {
                            var height = maxHeight - intersect[0].distance
                        }
                        points[x - 1].push(height)
                        offsetZ += (1 / precision)
                    }
                    offsetX += (1 / precision);
                    offsetZ = 1 / precision;
                }
                for (var i = 0; i < points.length; i++) {
                    points[i] = points[i].reverse()
                }
                const heightfieldShape = new CANNON.Heightfield(points, {
                    elementSize: 1 / precision // Distance between the data points in X and Y directions
                })
                const groundMaterial = new CANNON.Material('ground')
                this.heightfieldBody = new CANNON.Body({ mass: 0, shape: heightfieldShape, material: groundMaterial })
                this.heightfieldBody.quaternion.setFromEuler(Math.PI / 2, Math.PI, 0)
                this.heightfieldBody.position.set(box3.max.x - 1 / precision, 0, box3.min.z + 1 / precision)
                this.world.addBody(this.heightfieldBody)

                this.wheel_ground = new CANNON.ContactMaterial(this.wheelMaterial, groundMaterial, {
                    friction: 0.7,
                    restitution: 0,
                    contactEquationStiffness: 1E7,
                })
                this.world.addContactMaterial(this.wheel_ground)
                /* this.vehicle.setBrake(100, 0)
                this.vehicle.setBrake(100, 1)
                this.vehicle.setBrake(100, 2)
                this.vehicle.setBrake(100, 3) */

                /* for (let i = 0; i < physics.vehicle.wheelInfos.length; i++) {
                    physics.vehicle.applyEngineForce(10, i)
                } */

                /* for (let i = 0; i < physics.vehicle.wheelInfos.length; i++) {
                    physics.vehicle.setBrake(100, i)
                } */

                scene.add(this.ground)
            })
        })


    }

    Subdivide(A, B, x) {
        // Calculate the distance between the points A and B
        const distance = Math.abs(B - A);

        // Calculate the number of sections and ensure it's an integer
        const sections = Math.floor(distance / x);

        return sections;
    }

    update() {
        this.delta = clock.getDelta()
        if (this.delta < 0.1) {
            this.world.step(this.delta)
            this.cannonRenderer.update()
            try {
                this.tank.position.copy(this.tank.userData.body.position)
                this.tank.quaternion.copy(this.tank.userData.body.quaternion).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2))
                for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
                    this.vehicle.updateWheelTransform(i)
                    const transform = this.vehicle.wheelInfos[i].worldTransform
                    const wheelBody = this.wheelBodies[i]
                    wheelBody.position.copy(transform.position)
                    wheelBody.quaternion.copy(transform.quaternion)
                }
            } catch (e) { }
        }
    }
}

window.Physics = Physics