import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    BackgroundRenderer,
    // если у тебя другой дефолт — подставь свой
    DEFAULT_THREE_LINES_OPTIONS as DEFAULTS,
} from "../lib/background-renderer";

type Num = number;

type Opts = typeof DEFAULTS & {
    // гарантируем точные типы (если в DEFAULTS есть any)
    linesNumber: Num;
    linesLength: Num;
    vertexPerLines: Num;
    linesPadding: Num;
    slowFactor: Num;
    waveAmplitude: Num;
    waveFrequency: Num;
    waveSpeed: Num;
    wavePhase: Num;
    waveOffset: Num;
    baseAlpha: Num;
    color: number;
    cameraFov: Num;
    cameraPos: { x: Num; y: Num; z: Num };
    lookAt: { x: Num; y: Num; z: Num };
    rootRotation: { x: Num; y: Num; z: Num };
    rootPosition: { x: Num; y: Num; z: Num };
};

function useDebounced<T>(value: T, delay = 120) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setV(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return v;
}

export default function BackgroundTuner() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<BackgroundRenderer | null>(null);
    const [playing, setPlaying] = useState(true);

    const [opts, setOpts] = useState<Opts>(() => ({
        ...DEFAULTS,
        // мягкий старт под «ткань»
        linesNumber: 52,
        linesLength: 2800,
        vertexPerLines: 360,
        linesPadding: 12,

        slowFactor: 1.0,
        waveAmplitude: 16.0,
        waveFrequency: 0.009,
        waveSpeed: 0.85,
        wavePhase: 14.0,
        waveOffset: 0.6,

        baseAlpha: 0.32,
        color: 0x7ea2ff,

        cameraFov: 45,
        cameraPos: { x: -22, y: 26, z: 150 },
        lookAt: { x: 0, y: 0, z: 0 },

        rootRotation: { x: -14, y: 32, z: -8 },
        rootPosition: { x: -30, y: -8, z: 0 },
    }));

    // чтобы не пересоздавать движок на каждый тик — дебаунсим изменения
    const debounced = useDebounced(opts, 120);

    // (Re)mount renderer on debounced opts
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // dispose старого экземпляра
        engineRef.current?.dispose();

        const bg = new BackgroundRenderer(canvas, debounced);
        engineRef.current = bg;
        if (playing) bg.playAnimation();
        else bg.stopAnimation();

        return () => {
            bg.dispose();
            engineRef.current = null;
        };
    }, [debounced, playing]);

    // helpers
    const setNum =
        (path: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            const val = Number(raw);
            setOpts((o) => {
                const copy: any = structuredClone(o);
                const keys = path.split(".");
                let cur: any = copy;
                for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
                cur[keys[keys.length - 1]] = isFinite(val) ? val : 0;
                return copy;
            });
        };

    const setHex =
        (path: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const hex = e.target.value.replace("#", "");
            const num = parseInt(hex, 16);
            if (Number.isFinite(num)) {
                setOpts((o) => {
                    const copy: any = structuredClone(o);
                    const keys = path.split(".");
                    let cur: any = copy;
                    for (let i = 0; i < keys.length - 1; i++)
                        cur = cur[keys[i]];
                    cur[keys[keys.length - 1]] = num;
                    return copy;
                });
            }
        };

    const colorHex = useMemo(
        () => "#" + opts.color.toString(16).padStart(6, "0"),
        [opts.color]
    );

    return (
        <>
            <canvas ref={canvasRef} className="background__canvas" />

            <div className="bg-tuner">
                <div className="bg-tuner__row">
                    <button
                        className="bg-tuner__btn"
                        onClick={() => setPlaying((p) => !p)}
                        title={playing ? "Пауза" : "Старт"}
                    >
                        {playing ? "⏸" : "▶️"}
                    </button>
                    <button
                        className="bg-tuner__btn"
                        onClick={() => setOpts((o) => ({ ...DEFAULTS, ...o }))}
                        title="Вернуть значения из DEFAULTS"
                    >
                        Reset→DEFAULTS
                    </button>
                </div>

                <h4>Геометрия</h4>
                <div className="bg-tuner__grid">
                    <label>
                        linesNumber
                        <input
                            type="number"
                            min={1}
                            max={300}
                            value={opts.linesNumber}
                            onChange={setNum("linesNumber")}
                        />
                    </label>
                    <label>
                        linesLength
                        <input
                            type="number"
                            min={100}
                            step={50}
                            value={opts.linesLength}
                            onChange={setNum("linesLength")}
                        />
                    </label>
                    <label>
                        vertexPerLines
                        <input
                            type="number"
                            min={16}
                            step={4}
                            value={opts.vertexPerLines}
                            onChange={setNum("vertexPerLines")}
                        />
                    </label>
                    <label>
                        linesPadding
                        <input
                            type="number"
                            min={1}
                            step={1}
                            value={opts.linesPadding}
                            onChange={setNum("linesPadding")}
                        />
                    </label>
                </div>

                <h4>Волна/анимация</h4>
                <div className="bg-tuner__grid">
                    <label>
                        slowFactor
                        <input
                            type="number"
                            step={0.05}
                            value={opts.slowFactor}
                            onChange={setNum("slowFactor")}
                        />
                    </label>
                    <label>
                        waveAmplitude
                        <input
                            type="number"
                            step={0.5}
                            value={opts.waveAmplitude}
                            onChange={setNum("waveAmplitude")}
                        />
                    </label>
                    <label>
                        waveFrequency
                        <input
                            type="number"
                            step={0.0005}
                            value={opts.waveFrequency}
                            onChange={setNum("waveFrequency")}
                        />
                    </label>
                    <label>
                        waveSpeed
                        <input
                            type="number"
                            step={0.02}
                            value={opts.waveSpeed}
                            onChange={setNum("waveSpeed")}
                        />
                    </label>
                    <label>
                        wavePhase
                        <input
                            type="number"
                            step={0.5}
                            value={opts.wavePhase}
                            onChange={setNum("wavePhase")}
                        />
                    </label>
                    <label>
                        waveOffset
                        <input
                            type="number"
                            step={0.05}
                            value={opts.waveOffset}
                            onChange={setNum("waveOffset")}
                        />
                    </label>
                </div>

                <h4>Вид</h4>
                <div className="bg-tuner__grid">
                    <label>
                        baseAlpha
                        <input
                            type="number"
                            min={0}
                            max={1}
                            step={0.02}
                            value={opts.baseAlpha}
                            onChange={setNum("baseAlpha")}
                        />
                    </label>
                    <label>
                        color
                        <input
                            type="color"
                            value={colorHex}
                            onChange={setHex("color")}
                        />
                    </label>
                </div>

                <h4>Камера</h4>
                <div className="bg-tuner__grid">
                    <label>
                        FOV
                        <input
                            type="number"
                            min={20}
                            max={120}
                            step={1}
                            value={opts.cameraFov}
                            onChange={setNum("cameraFov")}
                        />
                    </label>
                    <label>
                        cam.x
                        <input
                            type="number"
                            step={1}
                            value={opts.cameraPos.x}
                            onChange={setNum("cameraPos.x")}
                        />
                    </label>
                    <label>
                        cam.y
                        <input
                            type="number"
                            step={1}
                            value={opts.cameraPos.y}
                            onChange={setNum("cameraPos.y")}
                        />
                    </label>
                    <label>
                        cam.z
                        <input
                            type="number"
                            step={1}
                            value={opts.cameraPos.z}
                            onChange={setNum("cameraPos.z")}
                        />
                    </label>
                </div>

                <h4>Поворот полотна</h4>
                <div className="bg-tuner__grid">
                    <label>
                        rot.x
                        <input
                            type="number"
                            step={1}
                            value={opts.rootRotation.x}
                            onChange={setNum("rootRotation.x")}
                        />
                    </label>
                    <label>
                        rot.y
                        <input
                            type="number"
                            step={1}
                            value={opts.rootRotation.y}
                            onChange={setNum("rootRotation.y")}
                        />
                    </label>
                    <label>
                        rot.z
                        <input
                            type="number"
                            step={1}
                            value={opts.rootRotation.z}
                            onChange={setNum("rootRotation.z")}
                        />
                    </label>
                    <label>
                        pos.x
                        <input
                            type="number"
                            step={1}
                            value={opts.rootPosition.x}
                            onChange={setNum("rootPosition.x")}
                        />
                    </label>
                    <label>
                        pos.y
                        <input
                            type="number"
                            step={1}
                            value={opts.rootPosition.y}
                            onChange={setNum("rootPosition.y")}
                        />
                    </label>
                    <label>
                        pos.z
                        <input
                            type="number"
                            step={1}
                            value={opts.rootPosition.z}
                            onChange={setNum("rootPosition.z")}
                        />
                    </label>
                </div>
            </div>
        </>
    );
}
