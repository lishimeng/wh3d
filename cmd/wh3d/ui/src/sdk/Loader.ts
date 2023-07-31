import { CubeTexture, CubeTextureLoader, DefaultLoadingManager, Group, Texture, TextureLoader } from "three"
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader"

import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Resources } from "./Resources"


class Loader {
    textures: Map<Resources, Texture>

    fonts: Map<Resources, Font>

    textureloader: TextureLoader

    cubeLoader: CubeTextureLoader

    fontLoader: FontLoader

    gltfLoader: GLTFLoader

    constructor() {
        this.textures = new Map()
        this.fonts = new Map()
        this.textureloader = new TextureLoader(DefaultLoadingManager)
        this.cubeLoader = new CubeTextureLoader(DefaultLoadingManager)
        this.fontLoader = new FontLoader(DefaultLoadingManager)
        this.gltfLoader = new GLTFLoader(DefaultLoadingManager)
    }

    loadFont(r: Resources, url: string, after?: (t: Font) => void | undefined) {
        this.fontLoader.load(url, (f) => {
            if (after != undefined) {
                after(f)
            }
            this.fonts.set(r, f)
        })
    }

    loadGltf(r: Resources, url: string, after?: (t: Group) => void | undefined) {
        this.gltfLoader.load(url, (f) => {
            if (after != undefined) {
                after(f.scene)
            }
        })
    }

    loadTexture(r: Resources, url: string, after?: (t: Texture) => void | undefined) {
        this.textureloader.load(url, (texture) => {
            if (after != undefined) {
                after(texture)
            }
            this.textures.set(r, texture)
        })
    }

    loadCube(r: Resources, urls: string[], after?: (t: CubeTexture) => void | undefined) {
        let c = this.cubeLoader.load(urls)
        if (after != undefined) {
            after(c)
        }
        this.textures.set(r, c)
    }

    getTexture(r: Resources): Texture {
        let t = this.textures.get(r)
        return t!
    }

    getFont(r: Resources): Font {
        let f = this.fonts.get(r)
        return f!
    }
}

export const DefaultLoader = new Loader()