import { useEffect, useRef } from "react";
import {
    BackgroundRenderer,
    DEFAULT_THREE_LINES_OPTIONS,
} from "../lib/background-renderer";

export default function Background3D() {
    const ref = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = ref.current!;
        const bg = new BackgroundRenderer(canvas, {
            ...DEFAULT_THREE_LINES_OPTIONS,

            // -- Настройки геометрии и плотности --
            linesNumber: 300,
            linesLength: 3500,
            vertexPerLines: 360,
            linesPadding: 25,

            // -- Настройки анимации и скорости --
            slowFactor: 0.6,
            waveAmplitude: 60.0,
            waveFrequency: 0.006,
            waveSpeed: 0.55,
            wavePhase: 60.0,
            waveOffset: 0.001,

            // -- Настройки внешнего вида --
            baseAlpha: 1.0,
            color: 0xc3d3f9,

            // -- Настройки камеры и сцены --
            cameraFov: 450,
            cameraPos: { x: 0, y: 60, z: 45 },
            lookAt: { x: 0, y: 0, z: 0 },
            
            rootRotation: { x: 15, y: -55, z: 0 },
            rootPosition: { x: -100, y: -100, z: -800 },

            neverPauseOnHidden: true,
        });

        bg.playAnimation();
        return () => bg.dispose();
    }, []);

    return (
        <canvas
            id="fullscreen-layout-canvas"
            ref={ref}
            className="background__canvas"
        />
    );
}

