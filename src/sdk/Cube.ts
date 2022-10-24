import { Object3D, Scene, Vector3 } from "three"

export interface Cube {
    mesh: Object3D
    animate(): void
    stopAnimate(): void
    update(handler: (mesh: Object3D) => void): void

    loc(x: number, y: number, z: number): void
    moveUp(n: number): void
    moveDown(n: number): void
    moveLeft(n: number): void
    moveRight(n: number): void
    moveForward(n: number): void
    moveBack(n: number): void

    setScene(s: Scene): void
}

export class CubeImpl implements Cube {
    mesh: Object3D
    scene!: Scene
    animateId: number = 0

    animateHandler: (m: Object3D) => void
    constructor(m: Object3D) {
        this.mesh = m
        this.animateHandler = function(m: Object3D) {}
    }

    init(): void {
        
    }

    setScene(s: Scene): void {
        this.scene = s
    }
    stopAnimate(): void {
        if (this.animateId > 0) {
            cancelAnimationFrame(this.animateId)
            this.animateId = 0
        }
    }
    animate(): void {
        this.animateId = requestAnimationFrame(() => {
            this.animate()
        })
        this.animateHandler(this.mesh)
    }

    loc(x: number, y: number, z: number): void {
        this.mesh.position.set(x, y, z)
    }
    moveUp(n: number): void {
        this.mesh.position.set(
            this.mesh.position.x,
            this.mesh.position.y + n,
            this.mesh.position.z)
    }
    moveDown(n: number): void {
        this.mesh.position.set(
            this.mesh.position.x,
            this.mesh.position.y - n,
            this.mesh.position.z)
    }
    moveLeft(n: number): void {
        this.mesh.position.set(
            this.mesh.position.x - n,
            this.mesh.position.y,
            this.mesh.position.z)
    }
    moveRight(n: number): void {
        this.mesh.position.set(
            this.mesh.position.x + n,
            this.mesh.position.y,
            this.mesh.position.z)
    }
    moveForward(n: number): void {
        this.mesh.position.set(
            this.mesh.position.x,
            this.mesh.position.y,
            this.mesh.position.z + n)
    }
    moveBack(n: number): void {
        this.mesh.position.set(
            this.mesh.position.x,
            this.mesh.position.y,
            this.mesh.position.z - n)
    }
    update(handler:(mesh: Object3D) => void): void {
        this.animateHandler = handler
    }

    addChild(c: Cube, loc: Vector3): void {
        // 设置相对位置
        let src = c.mesh.position
        c.mesh.position.setX(src.x + loc.x)
        c.mesh.position.setY(src.y + loc.y)
        c.mesh.position.setZ(src.z + loc.z)
        this.scene.add(c.mesh)
        // 将scene传递给子组件
        c.setScene(this.scene)
    }
    
}