const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//const scoreElement = document.getElementById('score');

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
    'resources/images/turf.jpg', // Right
    'resources/images/turf.jpg', // Left
    'resources/images/turf.jpg', // Top
    'resources/images/turf.jpg', // Bottom
    'resources/images/turf.jpg', // Front
    'resources/images/turf.jpg'  // Back
]);
scene.background = texture;


const textureLoader = new THREE.TextureLoader();
const goldTexture = textureLoader.load('resources/images/gold_block.png');
const diamondTexture = textureLoader.load('resources/images/minecraft_diamond_ore.jpg');
const redstoneTexture = textureLoader.load('resources/images/redstone_block.jpg');
const ironTexture = textureLoader.load('resources/images/iron_block.jpg');
const emeraldTexture = textureLoader.load('resources/images/emerald_block.jpg');
const netheriteTexture = textureLoader.load('resources/images/netherite.jpg');
const obsidianTexture = textureLoader.load('resources/images/obsidian.jpg');

const goldMaterial = new THREE.MeshBasicMaterial({ map: goldTexture });
const diamondMaterial = new THREE.MeshBasicMaterial({ map: diamondTexture });
const redstoneMaterial = new THREE.MeshBasicMaterial({ map: redstoneTexture });

const ironMaterial = new THREE.MeshBasicMaterial({ map: ironTexture });
const emeraldMaterial = new THREE.MeshBasicMaterial({ map: emeraldTexture });
const netheriteMaterial = new THREE.MeshBasicMaterial({ map: netheriteTexture });
const obsidianMaterial = new THREE.MeshBasicMaterial({ map: obsidianTexture });


let score = 0;
const scoreElement = document.getElementById('score');

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const prismGeometry = new THREE.ConeGeometry(1, 1, 3); 
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);

const targets = [];

function createTarget() {
    const shapes = [
        { geometry: cubeGeometry, materials: [goldMaterial, diamondMaterial, redstoneMaterial], type: 'cube' },
        { geometry: prismGeometry, materials: [ironMaterial, emeraldMaterial, netheriteMaterial], type: 'prism' },
        { geometry: cylinderGeometry, materials: [redstoneMaterial], type: 'cylinder' },
        { geometry: sphereGeometry, materials: [obsidianMaterial], type: 'sphere'}
    ];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    const material = shape.materials[Math.floor(Math.random() * shape.materials.length)];

    const target = new THREE.Mesh(shape.geometry, material);
    target.position.set(Math.random() * 10 - 5, Math.random() * 5 - 2.5, -10);
    target.userData = { velocity: Math.random() * 0.05 + 0.01, type: shape.type, material: material };
    scene.add(target);
    targets.push(target);
}

for (let i = 0; i < 5; i++) {
    createTarget();
}

// Used ChatGPT to help with object types and raycasting()
function shoot(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(targets);
    if (intersects.length > 0) {
        const target = intersects[0].object;
        scene.remove(target);
        targets.splice(targets.indexOf(target), 1);

        if (target.userData.type === 'cube') {
            if (target.material === diamondMaterial) {
                score += 10;
            } else if (target.material === goldMaterial) {
                score += 30;
            } else if (target.material === redstoneMaterial) {
                score -= 50;
            }
        } else if (target.userData.type === 'prism') {
            score += 20;
        } else if (target.userData.type === 'cylinder') {
            score -= 20;
        } else if (target.userData.type === 'sphere') {
            alert(`Game Over! Final Score: ${score}`);
            return;
        }

        scoreElement.textContent = `Score: ${score}`;
        createTarget();
    }
}

window.addEventListener('click', shoot);

function animate() {
    requestAnimationFrame(animate);

    targets.forEach(target => {
        target.position.z += target.userData.velocity;
        if (target.position.z > 0) {
            target.position.set(Math.random() * 10 - 5, Math.random() * 5 - 2.5, -10);
        }
    });

    renderer.render(scene, camera);
}
camera.position.z = 5;
animate();
