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
            linesNumber: 100, // Количество линий
            linesLength: 2600, // Длина линий
            vertexPerLines: 360, // Увеличьте количество точек для плавных волн
            linesPadding: 14, // Расстояние между линиями

            // -- Настройки анимации и скорости --
            slowFactor: 1.0, // Общая скорость анимации
            waveAmplitude: 16.0, // Высота волн. Чем больше, тем сильнее эффект
            waveFrequency: 0.009, // Частота волн. Меньше = более растянутые волны
            waveSpeed: 0.85, // Скорость движения волн
            wavePhase: 14.0, // Фазовый сдвиг для узора
            waveOffset: 0.6, // Сдвиг для создания "ряби"

            // -- Настройки внешнего вида --
            color: 0x7ea2ff, // Цвет линий
            baseAlpha: 0.92, // Базовая прозрачность

            // -- Настройки камеры и сцены --
            cameraFov: 45, // Угол обзора
            cameraPos: {
                // Позиция камеры
                x: -500,
                y: 100,
                z: 1000,
            },
            lookAt: {
                // Точка, на которую смотрит камера
                x: -250,
                y: 0,
                z: 0,
            },
            rootRotation: {
                // Поворот всей сцены
                x: 15,
                y: -5,
                z: 25,
            },
            rootPosition: {
                // Сдвиг всей сцены
                x: -50,
                y: 0,
                z: -200,
            },
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
