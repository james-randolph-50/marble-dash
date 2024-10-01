import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useState,useRef, useEffect } from "react";
import * as THREE from "three";

export default function Player() {
    
    const body = useRef();
    const [ subscribeKeys, getKeys ] = useKeyboardControls();
    const { rapier, world } = useRapier();
    const rapierWorld = world;

    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3());
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3());

    const jump = () => {
        const origin = body.current.translation();
        origin.y -= 0.31;
        const direction = { x: 0, y: -1, z: 0 };
        const ray = new rapier.Ray(origin, direction);
        const hit = rapierWorld.castRay(ray, 10, true)
        
        if(hit.timeOfImpact < 0.15) {
            body.current.applyImpulse({x: 0, y: 0.5, z: 0});
        }
    }

    useEffect(() => {
        const unsubscribeJump = subscribeKeys( 
            (state) => state.jump,
        (value) => {
            if(value) {
               jump();
                }
            })
        return () => unsubscribeJump();
    }, [])

    useFrame((state, delta) => {

        // Controls
        const { forward, backward, leftward, rightward } = getKeys();

        const impulse = {x:0, y: 0, z: 0};
        const torque = {x:0, y: 0, z: 0};

        const impulseStrength = 0.6 * delta;
        const torqueStrength = 0.2 * delta;

        if (forward) {
            impulse.z -= impulseStrength;
            torque.x -= torqueStrength;
        } 

        if (backward) {
            impulse.z += impulseStrength;
            torque.x += torqueStrength;
        } 

        if (leftward) {
            impulse.x -= impulseStrength;
            torque.z += torqueStrength;
        }

        if (rightward) {
            impulse.x += impulseStrength;
            torque.z -= torqueStrength;
        }

        body.current.applyImpulse(impulse);
        body.current.applyTorqueImpulse(torque);

        // Camera
        const bodyPosition = body.current.translation();
        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(bodyPosition);
        cameraPosition.z += 2.25;
        cameraPosition.y += 0.65;
        
        // Move camera above the ball so players can see the map
        const cameraTarget = new THREE.Vector3();
        cameraTarget.copy(bodyPosition);
        cameraTarget.y += 0.25;

        smoothedCameraPosition.lerp(cameraPosition, 0.1);
        smoothedCameraTarget.lerp(cameraTarget, 0.1);

        state.camera.position.copy(smoothedCameraPosition);
        state.camera.lookAt(smoothedCameraTarget);
        
    })


    return (
        <RigidBody canSleep={ false } ref={ body } position={[0, 1, 0]} colliders="ball" linearDamping={0.5} angularDamping={0.5} restitution={0.2} friction={1}>
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading color="mediumpurple" />
            </mesh>
        </RigidBody>
    )
}