"use client";

import { Box } from "@mui/material";

import { Canvas } from '@react-three/fiber'
import { DoubleSide } from 'three';
import { OrbitControls } from '@react-three/drei'


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
        <Box> Three.jsで図を作って描画する</Box>
        <Box> 青:x, 橙:y , 緑:z</Box>
        <Box> 前輪：１輪 or ２輪 ( TODO: ラジオボタンで切り替え)</Box>
        <Box sx={{ height: "500px" }}>
            {Object.keys(vehicle_data).length > 0 &&
                <Canvas>
                    <axesHelper args={[3]} />
                    <gridHelper args={[5, 100]} />
                    <OrbitControls />
                    <ambientLight intensity={0.1} />
                    <Vehicle vehicle_data={vehicle_data} />
                    <Ground vehicle_data={vehicle_data} />
                </Canvas>
            }
        </Box>
    </>)

}