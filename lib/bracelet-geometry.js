import * as THREE from 'three';

// Create a realistic bracelet geometry
export function createBraceletGeometry() {
  const group = new THREE.Group();
  
  // Main bracelet ring
  const ringGeometry = new THREE.TorusGeometry(2, 0.3, 16, 100);
  const ringMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd4af37, // Gold color
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  group.add(ring);
  
  // Add decorative elements (small spheres around the bracelet)
  const gemGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const gemMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8b0000, // Dark red gems
    metalness: 0.0,
    roughness: 0.0,
    transmission: 0.9,
    thickness: 0.1,
  });
  
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const gem = new THREE.Mesh(gemGeometry, gemMaterial);
    gem.position.x = Math.cos(angle) * 2.2;
    gem.position.z = Math.sin(angle) * 2.2;
    gem.position.y = 0.2;
    group.add(gem);
  }
  
  return group;
}