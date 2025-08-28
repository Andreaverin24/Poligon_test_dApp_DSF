import * as THREE from "three";

export type ThreeLinesOptions = {
    // Геометрия
    linesNumber: number;
    linesLength: number;
    vertexPerLines: number;
    linesPadding: number;

    // Шейдеры и анимация
    slowFactor: number;
    waveAmplitude: number;
    waveFrequency: number;
    waveSpeed: number;
    wavePhase: number;
    waveOffset: number;

    // Внешний вид
    color: number;
    baseAlpha: number;
    antialias: boolean;

    // Камера и сцена
    cameraFov: number;
    cameraPos: { x: number; y: number; z: number };
    lookAt: { x: number; y: number; z: number };
    rootRotation: { x: number; y: number; z: number };
    rootPosition: { x: number; y: number; z: number };
};

export const DEFAULT_THREE_LINES_OPTIONS: ThreeLinesOptions = {
    linesNumber: 100,
    linesLength: 1500,
    vertexPerLines: 100,
    linesPadding: 20,

    slowFactor: 0.5,
    waveAmplitude: 10.0,
    waveFrequency: 0.01,
    waveSpeed: 0.5,
    wavePhase: 10.0,
    waveOffset: 0.2,

    color: 0x7ea2ff,
    baseAlpha: 0.8,
    antialias: true,

    cameraFov: 75,
    cameraPos: { x: 0, y: 50, z: 200 },
    lookAt: { x: 0, y: 0, z: 0 },
    rootRotation: { x: 0, y: 0, z: 0 },
    rootPosition: { x: 0, y: 0, z: 0 },
};

const vertexShader = `
    uniform float u_time, u_waveAmplitude, u_waveFrequency, u_waveSpeed, u_wavePhase, u_waveOffset;
    attribute float xSmooth;
    attribute float zSmooth;
    varying float vAlpha;

    void main() {
        // Расчёт прозрачности
        vAlpha = (sin((position.x + u_time * u_wavePhase + xSmooth * 15.0) * u_waveOffset) * 0.5 + 0.5) * (sin((position.z * u_waveOffset + u_time * u_waveSpeed) * 0.5 + zSmooth * 10.0) * 0.5 + 0.5);
        vAlpha = clamp(vAlpha, 0.0, 1.0);

        // Расчёт волн по Y
        float waveY = sin(position.x * u_waveFrequency + u_time * u_waveSpeed) * u_waveAmplitude;
        // Добавление волны по Z (поперек линий)
        waveY += cos(position.z * u_waveFrequency + u_time * u_waveSpeed) * u_waveAmplitude;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, waveY, position.z, 1.0);
    }
`;

const fragmentShader = `
    uniform vec3 u_color;
    uniform float u_baseAlpha;
    varying float vAlpha;

    void main() {
        gl_FragColor = vec4(u_color, vAlpha * u_baseAlpha);
    }
`;

export class BackgroundRenderer {
    private canvas: HTMLCanvasElement;
    private renderer!: THREE.WebGLRenderer;
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private clock = new THREE.Clock(false);
    private playing = false;

    private root = new THREE.Group();
    private material!: THREE.ShaderMaterial;
    private meshes: THREE.Line[] = [];

    private opts: ThreeLinesOptions;

    private handleResize = () => this.resize();
    private handleVisibility = () => {
        if (document.hidden) this.stopAnimation();
        else if (this.playing) this.playAnimation();
    };

    constructor(
        canvas: HTMLCanvasElement,
        options: Partial<ThreeLinesOptions> = {}
    ) {
        if (!canvas) throw new Error("BackgroundRenderer: canvas is required");
        this.canvas = canvas;
        this.opts = { ...DEFAULT_THREE_LINES_OPTIONS, ...options };
        this.initThree();
        this.buildScene();
        this.resize();

        window.addEventListener("resize", this.handleResize, { passive: true });
        document.addEventListener("visibilitychange", this.handleVisibility);
    }

    playAnimation() {
        if (this.playing) return;
        this.playing = true;
        this.clock.start();
        this.renderer.setAnimationLoop(() => {
            this.tick();
            this.renderer.render(this.scene, this.camera);
        });
    }

    stopAnimation() {
        if (!this.playing) return;
        this.playing = false;
        this.clock.stop();
        this.renderer.setAnimationLoop(null as unknown as any);
    }

    dispose() {
        this.stopAnimation();
        window.removeEventListener("resize", this.handleResize);
        document.removeEventListener("visibilitychange", this.handleVisibility);
        this.meshes.forEach((m) => this.root.remove(m));
        this.material.dispose();
        this.renderer.dispose();
    }

    private initThree() {
        const o = this.opts;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: o.antialias,
            alpha: true,
            powerPreference: "high-performance",
        });
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.setClearAlpha(0);
        this.renderer.autoClear = true;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(o.cameraFov, 1, 1, 1000);
        this.camera.position.set(o.cameraPos.x, o.cameraPos.y, o.cameraPos.z);
        this.camera.lookAt(o.lookAt.x, o.lookAt.y, o.lookAt.z);

        this.root.rotation.set(
            THREE.MathUtils.degToRad(o.rootRotation.x),
            THREE.MathUtils.degToRad(o.rootRotation.y),
            THREE.MathUtils.degToRad(o.rootRotation.z)
        );
        this.root.position.set(
            o.rootPosition.x,
            o.rootPosition.y,
            o.rootPosition.z
        );
        this.scene.add(this.root);
    }

    private buildScene() {
        const o = this.opts;

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                u_time: { value: 0.0 },
                u_waveAmplitude: { value: o.waveAmplitude },
                u_waveFrequency: { value: o.waveFrequency },
                u_waveSpeed: { value: o.waveSpeed },
                u_wavePhase: { value: o.wavePhase },
                u_waveOffset: { value: o.waveOffset },
                u_color: { value: new THREE.Color(o.color) },
                u_baseAlpha: { value: o.baseAlpha },
            },
            transparent: true,
            depthWrite: false,
        });

        for (let t = 0; t < o.linesNumber; t++) {
            const geometry = new THREE.BufferGeometry();
            const positions = [];
            const xSmooths = [];
            const zSmooths = [];
            const halfLength = o.linesLength / 2;

            const a = t * o.linesPadding - (o.linesNumber * o.linesPadding) / 2;
            for (let c = 0; c < o.vertexPerLines; c++) {
                positions.push(
                    (o.linesLength / o.vertexPerLines) * c - halfLength,
                    0,
                    a
                );
                xSmooths.push(c / 60);
                zSmooths.push(t / 60);
            }

            geometry.setAttribute(
                "position",
                new THREE.Float32BufferAttribute(positions, 3)
            );
            geometry.setAttribute(
                "xSmooth",
                new THREE.Float32BufferAttribute(xSmooths, 1)
            );
            geometry.setAttribute(
                "zSmooth",
                new THREE.Float32BufferAttribute(zSmooths, 1)
            );

            const line = new THREE.Line(geometry, this.material);
            this.root.add(line);
            this.meshes.push(line);
        }
    }

    private resize() {
        const { clientWidth, clientHeight } = this.canvas;
        if (!clientWidth || !clientHeight) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(clientWidth, clientHeight, false);
        this.camera.aspect = clientWidth / clientHeight;
        this.camera.updateProjectionMatrix();
    }

    private tick() {
        const t = this.clock.getElapsedTime();
        this.material.uniforms.u_time.value = t * this.opts.slowFactor;
    }
}
