"use client";

import { Box, linkClasses } from "@mui/material";

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { DoubleSide } from 'three';
import { OrbitControls } from '@react-three/drei'
import * as THREE from "three"
import { useRef } from "react";
import { useEffect } from "react";


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
    line.material.linewidth = 3;
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
                (vehicle_data.vehicle_height + vehicle_data.wheel_radius) / 2,
                vehicle_data.wheel_base / 2]}>
                <boxGeometry args={[
                    vehicle_data.wheel_tread,
                    vehicle_data.vehicle_height - vehicle_data.wheel_radius,
                    vehicle_data.wheel_base,
                ]} />
                <meshPhongMaterial color="#000088" opacity={0.5} transparent={true} />
            </mesh>

            {/* rear_overhang */}
            <mesh position={[0,
                (vehicle_data.vehicle_height + vehicle_data.wheel_radius) / 2,
                -vehicle_data.rear_overhang / 2]}>
                <boxGeometry args={[
                    vehicle_data.wheel_tread,
                    vehicle_data.vehicle_height - vehicle_data.wheel_radius,
                    vehicle_data.rear_overhang,
                ]} />
                <meshPhongMaterial color="blue" opacity={0.5} transparent={true} />
            </mesh>

            {/* front_overhang */}
            <mesh position={[0,
                (vehicle_data.vehicle_height + vehicle_data.wheel_radius) / 2,
                vehicle_data.front_overhang / 2 + vehicle_data.wheel_base]}>
                <boxGeometry args={[
                    vehicle_data.wheel_tread,
                    vehicle_data.vehicle_height - vehicle_data.wheel_radius,
                    vehicle_data.front_overhang,
                ]} />
                <meshPhongMaterial color="blue" opacity={0.5} transparent={true} />
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
            <mesh position={[vehicle_data.wheel_tread / 2 - vehicle_data.wheel_width / 2 - offset, vehicle_data.wheel_radius, 0]}
                rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                <cylinderGeometry args={[
                    vehicle_data.wheel_radius, vehicle_data.wheel_radius,
                    vehicle_data.wheel_width, 64
                ]} />
                <meshPhongMaterial color="red" />
            </mesh>

            {/* rear_right */}
            <mesh position={[-vehicle_data.wheel_tread / 2 + vehicle_data.wheel_width / 2 + offset, vehicle_data.wheel_radius, 0]}
                rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                <cylinderGeometry args={[
                    vehicle_data.wheel_radius, vehicle_data.wheel_radius,
                    vehicle_data.wheel_width, 64
                ]} />
                <meshPhongMaterial color="red" />
            </mesh>

            {/* front_left */}
            <mesh position={[vehicle_data.wheel_tread / 2 - vehicle_data.wheel_width / 2 - offset, vehicle_data.wheel_radius, vehicle_data.wheel_base]}
                rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                <cylinderGeometry args={[
                    vehicle_data.wheel_radius, vehicle_data.wheel_radius,
                    vehicle_data.wheel_width, 64
                ]} />
                <meshPhongMaterial color="red" />
            </mesh>

            {/* front_right */}
            <mesh position={[-vehicle_data.wheel_tread / 2 + vehicle_data.wheel_width / 2 + offset, vehicle_data.wheel_radius, vehicle_data.wheel_base]}
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
                (vehicle_data.vehicle_height + vehicle_data.wheel_radius) / 2,
                (vehicle_data.wheel_base + vehicle_data.front_overhang - vehicle_data.rear_overhang) / 2
            ]}>
                <boxGeometry args={[
                    vehicle_data.left_overhang, //y
                    vehicle_data.vehicle_height - vehicle_data.wheel_radius, //z
                    vehicle_data.front_overhang + vehicle_data.wheel_base + vehicle_data.rear_overhang,//x
                ]} />
                <meshPhongMaterial color="#aaaaff" opacity={0.5} transparent={true} />
            </mesh>

            <mesh position={[
                -(vehicle_data.wheel_tread / 2 + vehicle_data.right_overhang / 2),
                (vehicle_data.vehicle_height + vehicle_data.wheel_radius) / 2,
                (vehicle_data.wheel_base + vehicle_data.front_overhang - vehicle_data.rear_overhang) / 2
            ]}>
                <boxGeometry args={[
                    vehicle_data.right_overhang, //y
                    vehicle_data.vehicle_height - vehicle_data.wheel_radius, //z
                    vehicle_data.front_overhang + vehicle_data.wheel_base + vehicle_data.rear_overhang,//x
                ]} />
                <meshPhongMaterial color="#aaaaff" opacity={0.5} transparent={true} />
            </mesh>
        </>);
}

export const Ground = ({ vehicle_data }) => {
    if (vehicle_data === {}) {
        return (<></>);
    }
    return (<>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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
                    <MyAxes />
                    <gridHelper args={[10, 20]} />
                    <gridHelper args={[10, 20]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
                    <gridHelper args={[10, 20]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
                    <OrbitControls />
                    <ambientLight intensity={0.1} />
                    <Vehicle vehicle_data={vehicle_data} />
                    <Ground vehicle_data={vehicle_data} />
                </Canvas>
            }
        </Box>
    </>)

}

export const AxisHelper2 = ({ color, direction, length, pos }) => {
    const { scene } = useThree();
    console.log(pos)
    const normalizedDirection = direction.normalize();
    const arrowHeadLength = length * 0.05;

    const arrowGeometry = new THREE.ConeGeometry(arrowHeadLength, arrowHeadLength * 2, 8);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color });
    const arrowMesh = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrowMesh.position.copy(normalizedDirection.multiplyScalar(length - arrowHeadLength));

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(
        [[pos.x, pos.y, pos.z], normalizedDirection.multiplyScalar(length - arrowHeadLength)]);
    const lineMaterial = new THREE.LineBasicMaterial({ color });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.material.linewidth = 3;

    // scene.add(arrowMesh);
    scene.add(line);

    return null;
};


export const MyAxes2 = ({ pos }) => {
    const axis_length = 0.3;
    return (<>
        {/* <AxisHelper2
            color="red"
            direction={new THREE.Vector3(0, 0, 1)}
            length={axis_length}
            pos={pos}
        /> */}
    </>)
}


function Cube2({ parents, child, frame_id }) {
    const cubeRef = useRef();

    // useEffect(() => {
    //     // マウスオーバー時のイベントハンドラを追加
    //     const handleMouseOver = () => {
    //         console.log('Mouse over event');
    //         // ここで好きな処理を行います
    //     };

    //     cubeRef.current.addEventListener('mouseover', handleMouseOver);
    //     return () => {
    //         cubeRef.current.removeEventListener('mouseover', handleMouseOver);
    //     };
    // });


    useFrame(() => {
        updateTransforms();
    });

    function updateTransforms() {

        const joint_list = [...parents, child];
        let sum_roll = 0;
        let sum_pitch = 0;
        let sum_yaw = 0;
        for (let i = 0; i < joint_list.length - 1; i++) {
            const currentJoint = joint_list[i];
            const nextJoint = joint_list[i + 1];
            const position = new THREE.Vector3(currentJoint.y, currentJoint.z, currentJoint.x);
            const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
                0, 0, 0,
                'YZX'
            ));
            sum_roll += nextJoint.roll;
            sum_pitch += nextJoint.pitch;
            sum_yaw += nextJoint.yaw;

            // リンクの座標変換を適用
            cubeRef.current.position.copy(position);
            cubeRef.current.quaternion.copy(quaternion);

            // 次のジョイントまでの変換行列を計算
            const nextPosition = new THREE.Vector3(nextJoint.y, nextJoint.z, nextJoint.x);
            const nextQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
                0, 0, 0,
                'YZX'
            ));

            const transformMatrix = new THREE.Matrix4();
            transformMatrix.compose(nextPosition, nextQuaternion, new THREE.Vector3(1, 1, 1));

            // 次のリンクの座標変換を適用
            cubeRef.current.applyMatrix4(transformMatrix);

            // cubeRef.current.rotateX(sum_pitch);
            // cubeRef.current.rotateY(sum_yaw);
            // cubeRef.current.rotateZ(sum_roll);

        }

    }

    return (
        <>
            <mesh ref={cubeRef}
                onClick={() => {
                    // console.log(child, frame_id)
                }}
            >
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshBasicMaterial color={0x00ff00} wireframe={true} opacity={0.5} transparent={true} />
                <CubeAxes link={[...parents, child]} frame_id={frame_id} />
            </mesh>
        </>
    );
}


export const CubeAxisHelper = ({ color, direction, length }) => {
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
    line.material.linewidth = 3;
    // scene.add(arrowMesh);
    scene.add(line);

    return null;
};

const CubeAxes = ({ link, frame_id }) => {
    const axisRef = useRef();
    const length = 0.125;
    const linewidth = 2;

    useFrame(() => {
        const roll = link.reduce((sum, ele) => {
            return sum + ele.roll;
        }, 0);
        const pitch = link.reduce((sum, ele) => {
            return sum + ele.pitch;
        }, 0);
        const yaw = link.reduce((sum, ele) => {
            return sum + ele.yaw;
        }, 0);
        //(yaw, pitch, roll)
        // const rotation = new THREE.Euler(0, 0, 0);
        // const rotation = new THREE.Euler(yaw, pitch, roll);
        const rotation = new THREE.Euler(pitch, yaw, roll);
        // console.log(frame_id, roll, pitch, yaw);
        axisRef.current.rotation.copy(rotation);
    });
    return (
        <group ref={axisRef}>
            <line>
                <bufferGeometry attach="geometry"
                    {...new THREE.BufferGeometry().setFromPoints(
                        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0)])} />
                <lineBasicMaterial color="green" attach="material" linewidth={linewidth} />
            </line>
            <line>
                <bufferGeometry attach="geometry"
                    {...new THREE.BufferGeometry().setFromPoints(
                        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0)])} />
                <lineBasicMaterial color="blue" attach="material" linewidth={linewidth} />
            </line>
            <line>
                <bufferGeometry attach="geometry"
                    {...new THREE.BufferGeometry().setFromPoints(
                        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length)])} />
                <lineBasicMaterial color="red" attach="material" linewidth={linewidth} />
            </line>
        </group>
    );
};

const CustomAxis = ({ direction, length, color }) => {
    const axisRef = useRef();

    useFrame(() => {
        // メッシュの位置や向きに応じて軸を更新するために、useFrameフックを使用します
        const mesh = axisRef.current;
        const position = mesh.parent.position;
        const rotation = mesh.parent.rotation;

        // 向きを基本軸とした軸を作成します
        // const axis = new THREE.Vector3(direction.x, direction.y, direction.z).normalize();
        const axis = new THREE.Vector3(rotation.y, rotation.z, rotation.x).normalize();
        const arrowHelper = new THREE.ArrowHelper(axis, position, length, new THREE.Color(color));

        // メッシュの位置や向きに合わせて軸を配置します
        arrowHelper.position.copy(position);
        arrowHelper.rotation.copy(rotation);

        // メッシュに軸を追加します
        mesh.add(arrowHelper);
    });

    return <group ref={axisRef} />;
};


export function Sensor({ parents, child, frame_id }) {
    return (<>
        <Cube2 parents={parents} child={child} frame_id={frame_id} />
    </>);
}