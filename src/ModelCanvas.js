import React, { useEffect, useState } from "react";
import { OBJLoader } from "three/addons/loaders/OBJLoader";
import { MTLLoader } from "three/addons/loaders/MTLLoader";
import { TGALoader } from "three/addons/loaders/TGALoader";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function MyModel() {
  const { scene, camera } = useThree();
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768 ? true : false
  );

  useEffect(() => {
    const manager = new THREE.LoadingManager();
    manager.addHandler(/.tga$/i, new TGALoader());
    const objLoader = new OBJLoader(manager);
    const mtlLoader = new MTLLoader(manager);
    objLoader.setPath("./cicada/");
    mtlLoader.setPath("./cicada/");

    mtlLoader.load("cicada.mtl", (materials) => {
      materials.preload();
      objLoader.setMaterials(materials);

      objLoader.load("cicada.obj", (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            const texture = materials.materials[child.material.name].map;
            child.material = new THREE.MeshStandardMaterial({
              map: texture,
            });
          }
        });

        // Set the model size relative to the viewport width
        if (isMobile) object.scale.set(0.04, 0.06, 0.06);
        else object.scale.set(0.06, 0.06, 0.06);

        // Center the model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);

        scene.add(object);
      });
    });

    // Brighter lights
    const ambientLight = new THREE.AmbientLight(0x404040, 20); // Increased intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 8); // Increased intensity
    directionalLight.position.set(0, 1, 0);
    scene.add(ambientLight);
    scene.add(directionalLight);

    // Handle window resize for device scale
    function handleResize() {
      setIsMobile(window.innerWidth < 768 ? true : false);
    }

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [scene, camera]);

  return null;
}

export const ModelCanvas = () => {
  return (
    <Canvas style={{ width: "100vw", height: "100vh", background: "gray" }}>
      <MyModel />
      <OrbitControls />
    </Canvas>
  );
};
