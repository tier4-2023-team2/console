"use client";

import { Box } from "@mui/material";

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { DoubleSide } from 'three';
import { OrbitControls } from '@react-three/drei'
import * as THREE from "three"
import { useRef } from "react";


//  {/* 本来 */}
//   {/* position = {[x, y, z]} */}
//   {/* args = {[width(x), height(y), depth(z)]} */}
//   {/* rotation = {[roll, pitch, yaw]} */}
//   {/* axis ={r: x, b: y, g: z} */}

//   {/* このシステム */}
//   {/* position = {[y, z, x]} */}
//   {/* args = {[height(y), width(x), depth(z)]} */}
//   {/* rotation = {[pitch, roll, yaw]} */}
//   {/* axis ={b: x, r: y, g: z} */}

export const AxisHelper = ({ color, direction, length }) => {
    const { scene } = useThree();

    const normalizedDirection = direction.normalize();
    const arrowHeadLength = length * 0.05;

    const arrowGeometry = new THREE.ConeGeometry(arrowHeadLength, arrowHeadLength * 2, 8);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color });
    const arrowMesh = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrowMesh.position.copy(normalizedDirection.multiplyScalar(length - arrowHeadLength));

    const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), normalizedDirection.multiplyScalar(length - arrowHeadLength)]);
    const lineMaterial = new THREE.LineBasicMaterial({ color });
    const line = new THREE.Line(lineGeometry, lineMaterial);

    // scene.add(arrowMesh);
    scene.add(line);

    return null;
};

export const MyAxes = () => {
    const axis_length = 3;
    return (<>
        <AxisHelper color="red" direction={new THREE.Vector3(0, 0, 1)} length={axis_length} />
        <AxisHelper color="green" direction={new THREE.Vector3(1, 0, 0)} length={axis_length} />
        <AxisHelper color="blue" direction={new THREE.Vector3(0, 1, 0)} length={axis_length} />
    </>)
}

export const VehicleBody = ({ vehicle_data }) => {
    if (vehicle_data === {}) {
        return (<></>);
    }
    return (
        <>
            {/* TODO ホイール分浮いているので、削るかどうにかする */}
            {/* main */}
            <mesh position={[
                0,
                // vehicle_data.vehicle_height / 2,
                (vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2) / 2,
                vehicle_data.wheel_base / 2]}>
                <boxGeometry args={[
                    vehicle_data.wheel_tread,
                    vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2,
                    vehicle_data.wheel_base,
                ]} />
                <meshPhongMaterial color="#000088" />
            </mesh>

            {/* rear_overhang */}
            <mesh position={[0,
                // vehicle_data.vehicle_height / 2,
                (vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2) / 2,
                -vehicle_data.rear_overhang / 2]}>
                <boxGeometry args={[
                    vehicle_data.wheel_tread,
                    vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2,
                    vehicle_data.rear_overhang,
                ]} />
                <meshPhongMaterial color="blue" />
            </mesh>

            {/* front_overhang */}
            <mesh position={[0,
                (vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2) / 2,
                vehicle_data.front_overhang / 2 + vehicle_data.wheel_base]}>
                <boxGeometry args={[
                    vehicle_data.wheel_tread,
                    vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2,
                    vehicle_data.front_overhang,
                ]} />
                <meshPhongMaterial color="blue" />
            </mesh>
        </>
    );
}

export const VehicleWheel = ({ vehicle_data }) => {
    const offset = 0.0;
    if (vehicle_data === {}) {
        return (<></>);
    }
    return (
        <>
            {/* rear_left */}
            <mesh position={[vehicle_data.wheel_tread / 2 - vehicle_data.wheel_width / 2 - offset, 0, 0]}
                rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                <cylinderGeometry args={[
                    vehicle_data.wheel_radius, vehicle_data.wheel_radius,
                    vehicle_data.wheel_width, 64
                ]} />
                <meshPhongMaterial color="red" />
            </mesh>

            {/* rear_right */}
            <mesh position={[-vehicle_data.wheel_tread / 2 + vehicle_data.wheel_width / 2 + offset, 0, 0]}
                rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                <cylinderGeometry args={[
                    vehicle_data.wheel_radius, vehicle_data.wheel_radius,
                    vehicle_data.wheel_width, 64
                ]} />
                <meshPhongMaterial color="red" />
            </mesh>

            {/* front_left */}
            <mesh position={[vehicle_data.wheel_tread / 2 - vehicle_data.wheel_width / 2 - offset, 0, vehicle_data.wheel_base]}
                rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                <cylinderGeometry args={[
                    vehicle_data.wheel_radius, vehicle_data.wheel_radius,
                    vehicle_data.wheel_width, 64
                ]} />
                <meshPhongMaterial color="red" />
            </mesh>

            {/* front_right */}
            <mesh position={[-vehicle_data.wheel_tread / 2 + vehicle_data.wheel_width / 2 + offset, 0, vehicle_data.wheel_base]}
                rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                <cylinderGeometry args={[
                    vehicle_data.wheel_radius, vehicle_data.wheel_radius,
                    vehicle_data.wheel_width, 64
                ]} />
                <meshPhongMaterial color="red" />
            </mesh>

        </>
    );
}

export const VehicleSideOverhang = ({ vehicle_data }) => {
    if (vehicle_data === {}) {
        return (<></>);
    }
    return (
        <>
            <mesh position={[
                (vehicle_data.wheel_tread / 2 + vehicle_data.left_overhang / 2),
                (vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2) / 2,
                (vehicle_data.wheel_base + vehicle_data.front_overhang - vehicle_data.rear_overhang) / 2
            ]}>
                <boxGeometry args={[
                    vehicle_data.left_overhang, //y
                    vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2, //z
                    vehicle_data.front_overhang + vehicle_data.wheel_base + vehicle_data.rear_overhang,//x
                ]} />
                <meshPhongMaterial color="#aaaaff" />
            </mesh>

            <mesh position={[
                -(vehicle_data.wheel_tread / 2 + vehicle_data.right_overhang / 2),
                (vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2) / 2,
                (vehicle_data.wheel_base + vehicle_data.front_overhang - vehicle_data.rear_overhang) / 2
            ]}>
                <boxGeometry args={[
                    vehicle_data.right_overhang, //y
                    vehicle_data.vehicle_height - vehicle_data.wheel_radius / 2, //z
                    vehicle_data.front_overhang + vehicle_data.wheel_base + vehicle_data.rear_overhang,//x
                ]} />
                <meshPhongMaterial color="#aaaaff" />
            </mesh>
        </>);
}

export const Ground = ({ vehicle_data }) => {
    if (vehicle_data === {}) {
        return (<></>);
    }
    return (<>
        <mesh position={[0, -vehicle_data.wheel_radius, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[
                (vehicle_data.wheel_base + vehicle_data.front_overhang + vehicle_data.rear_overhang) * 2.5,
                (vehicle_data.wheel_base + vehicle_data.front_overhang + vehicle_data.rear_overhang) * 2.5
            ]} />
            <meshStandardMaterial color="rgba(255,255,255,1)" side={DoubleSide} />
        </mesh>
    </>)
}

export const Vehicle = ({ vehicle_data }) => {
    return (<>
        <VehicleBody vehicle_data={vehicle_data} />
        <VehicleWheel vehicle_data={vehicle_data} />
        <VehicleSideOverhang vehicle_data={vehicle_data} />
    </>)
}

export default function VehicleModelView({ vehicle_data }) {
    return (<>
        <Box sx={{ height: "500px", border: "solid" }}>
            {Object.keys(vehicle_data).length > 0 &&
                <Canvas>
                    {/* <axesHelper args={[3]} /> */}
                    <MyAxes />
                    <gridHelper args={[5, 10]} />
                    <OrbitControls />
                    <ambientLight intensity={0.1} />
                    <Vehicle vehicle_data={vehicle_data} />
                    <Ground vehicle_data={vehicle_data} />
                </Canvas>
            }
        </Box>
    </>)

}


function Cube({ parents, child }) {
    const cubeRef = useRef();

    useFrame(() => {
        updateTransforms();
    });

    function updateTransforms() {

        const joint_list = [...parents, child];
        for (let i = 0; i < joint_list.length - 1; i++) {
            const currentJoint = joint_list[i];
            const nextJoint = joint_list[i + 1];

            const position = new THREE.Vector3(currentJoint.y, currentJoint.z, currentJoint.x);
            const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
                currentJoint.pitch,
                currentJoint.yaw,
                currentJoint.roll,
                'YZX'
            ));

            // リンクの座標変換を適用
            cubeRef.current.position.copy(position);
            cubeRef.current.quaternion.copy(quaternion);

            // 次のジョイントまでの変換行列を計算
            const nextPosition = new THREE.Vector3(nextJoint.y, nextJoint.z, nextJoint.x);
            const nextQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
                nextJoint.pitch,
                nextJoint.yaw,
                nextJoint.roll,
                'YZX'
            ));

            const transformMatrix = new THREE.Matrix4();
            transformMatrix.compose(nextPosition, nextQuaternion, new THREE.Vector3(1, 1, 1));

            // 次のリンクの座標変換を適用
            cubeRef.current.applyMatrix4(transformMatrix);
        }

    }

    return (
        <mesh ref={cubeRef}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color={0x00ff00} />
        </mesh>
    );
}


export function Sensor({ parents, child }) {
    return (<>
        <Cube parents={parents} child={child} />
    </>);
}