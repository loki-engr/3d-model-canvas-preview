// ModelCanvas.js
import React, { useEffect } from "react";
import { OBJLoader } from "three/addons/loaders/OBJLoader";
import { MTLLoader } from "three/addons/loaders/MTLLoader";
import { TGALoader } from "three/addons/loaders/TGALoader";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function MyModel() {
  const { scene } = useThree();
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
        // object.traverse((child) => {
        //   if (child.isMesh) {
        //     // Use MeshBasicMaterial to display color without lighting
        //     child.material = new THREE.MeshBasicMaterial({
        //       map: materials.materials[child.material.name].map,
        //       color: materials.materials[child.material.name].color,
        //     });
        //   }
        // });
        object.traverse((child) => {
          if (child.isMesh) {
            // Apply MeshStandardMaterial for realistic lighting
            const texture = materials.materials[child.material.name].map;
            child.material = new THREE.MeshStandardMaterial({
              map: texture,
            });
          }
        });
        object.scale.multiplyScalar(0.1);
        scene.add(object);
      });
    });
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0);
    scene.add(ambientLight);
    scene.add(directionalLight);
  }, [scene]);

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
