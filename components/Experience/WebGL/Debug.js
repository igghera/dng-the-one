import { Pane } from 'tweakpane'
import * as TweakpaneFileImportPlugin from 'tweakpane-plugin-file-import'
import { textureLoader } from '~/assets/js/loaders'
import { RepeatWrapping } from 'three/webgpu'
import { snapdom } from '@zumer/snapdom'
import { cropTransparentPixels } from '~/assets/js/croptransparentPixels'

import {
  speed,
  strength,
  stretchX,
  stretchY,
  scale,
  normalDerivativeStep as floorNormalDerivativeStep,
  normalBlend as floorNormalBlend,
  normalSmoothingRadius as floorNormalSmoothingRadius,
  baseReflectivity as floorBaseReflectivity,
  reflectionStrength as floorReflectionStrength,
} from './materials/floor'

import {
  scaleBottom as godraysScaleBottom,
  scaleTop as godraysScaleTop,
  scaleHeight as godraysScaleHeight,
  noiseScale as godraysNoiseScale,
  godraysColor,
  opacity as godraysOpacity,
  timeSpeed as godraysTimeSpeed,
  smoothTop as godraysSmoothTop,
  smoothBottom as godraysSmoothBottom,
  fresnelPower as godraysFresnelPower,
  obstructionScale as godraysObstructionScale,
} from './materials/godrays'

import {
  progress as backgroundProgress
} from './materials/background'

import {
  sizeMin as particlesSizeMin,
  sizeMax as particlesSizeMax,
  opacity as particlesOpacity,
  strength as particlesNoiseStrength,
  speed as particlesSpeed,
  particleColor,
} from './materials/particles'

import {
  progress as maskProgress,
  radius as maskRadius,
  borderWidth as maskBorderWidth,
  maskColorA as maskBorderColorA,
  maskColorB as maskBorderColorB,
} from './materials/mask'

import {
  threshold as bloomThreshold,
  strength as bloomStrength,
  radius as bloomRadius,
} from './nodes/bloom'

import {
  intensity as lutIntensity,
} from './nodes/lut'

export class Debug {
  constructor(dof, godrays, background, particles, endDrawMaterial, introDrawMaterial, introSceneVisibility, sea) {
    this.pane = new Pane({
      title: 'Debug',
      container: document.getElementById('debug-wrapper'),
    })

    this.pane.registerPlugin(TweakpaneFileImportPlugin)

    this.createScreenshot()
    this.createIntro(introDrawMaterial, introSceneVisibility)
    this.createBackground(background)
    // this.createSea()
    this.createSeaNew(sea)
    // this.createDof(dof)
    this.createGodrays(godrays)
    this.createParticles(particles)
    this.createEndDrawPlane(endDrawMaterial)
    this.createMask()
    this.createBloom()
    this.createLUT()
  }

  createScreenshot() {
    const folder = this.pane.addFolder({
      title: 'Screenshot',
      expanded: true,
    })

    folder.addButton({ title: 'Take WebGL Screenshot' }).on('click', async () => {
      const el = document.getElementById('experience-canvas')
      const filename = `the-one-screenshot-${Date.now()}`
      const canvas = await snapdom.toCanvas(el)

      cropTransparentPixels(canvas, { padding: 0, inset: 20, filename })
    })
  }

  createIntro(material, visibility) {
    const folder = this.pane.addFolder({
      title: 'Intro',
      expanded: false,
    })

    folder.addBinding(visibility, 'value', { label: 'Visibility', min: 0, max: 1 })

    // folder.addBlade({ view: 'separator' })

    // folder.addBinding(introBackgroundColorA, 'value', { label: 'Background Color A', color: { type: 'float' } })
    // folder.addBinding(introBackgroundColorB, 'value', { label: 'Background Color B', color: { type: 'float' } })

    folder.addBlade({ view: 'separator' })

    folder.addBinding(material.opacity, 'value', { label: 'Shape Opacity', min: 0, max: 1 })
    folder.addBinding(material.smooth, 'value', { label: 'Shape Gradient Smooth', min: 0, max: 1 })
    folder.addBinding(material.progress, 'value', { label: 'Shape Draw', min: 0, max: 1 })
    folder.addBinding(material.colorA, 'value', { label: 'Shape Color A', color: { type: 'float' } })
    folder.addBinding(material.colorB, 'value', { label: 'Shape Color B', color: { type: 'float' } })
  }

  createBackground(background) {
    const backgroundFolder = this.pane.addFolder({
      title: 'Background',
      expanded: false,
    })

    backgroundFolder.addBinding(background.position, 'z', { label: 'Depth', min: -10, max: -3 })
    backgroundFolder.addBinding(background.position, 'y', { label: 'Position Y', min: -5, max: 5 })

    backgroundFolder.addBlade({ view: 'separator' })

    backgroundFolder.addBinding(backgroundProgress, 'value', { label: 'Progress', min: 0, max: 1 })
  }

  /**
   * @deprecated
   */
  createSea() {
    const sea = this.pane.addFolder({
      title: 'Sea',
      expanded: false,
    })

    sea.addBinding(floorBaseReflectivity, 'value', { label: 'Base Reflectivity', min: 0, max: 5 })
    sea.addBinding(floorReflectionStrength, 'value', { label: 'Reflection Strength', min: 0, max: 20, step: 0.1 })
    sea.addBinding(strength, 'value', { label: 'Strength', min: 0, max: 2 })
    sea.addBinding(speed, 'value', { label: 'Speed', min: -0.1, max: 0.1, step: 0.001 })
    sea.addBinding(scale, 'value', { label: 'Scale', min: 0, max: 5 })
    sea.addBinding(stretchX, 'value', { label: 'Stretch X', min: 0, max: 5 })
    sea.addBinding(stretchY, 'value', { label: 'Stretch Y', min: 0, max: 5 })
    // sea.addBinding(floorMetalness, 'value', { label: 'Metalness', min: 0, max: 1 })
    // sea.addBinding(floorRoughness, 'value', { label: 'Roughness', min: 0, max: 1 })

    sea.addBlade({ view: 'separator' })

    sea.addBinding(floorNormalDerivativeStep, 'value', { label: 'Derivative Step', min: 0.001, max: 0.1, step: 0.001 })
    sea.addBinding(floorNormalBlend, 'value', { label: 'Blend', min: 0, max: 1 })
    sea.addBinding(floorNormalSmoothingRadius, 'value', { label: 'Smoothing Radius', min: 0, max: 0.1, step: 0.001 })
  }

  createSeaNew(sea) {
    const folder = this.pane.addFolder({
      title: 'Sea (New)',
      expanded: false,
    })

    folder.addBinding(sea.alpha, 'value', { label: 'Alpha', min: 0, max: 1 })
    folder.addBinding(sea.size, 'value', { label: 'Size', min: 1, max: 20 })
    folder.addBinding(sea.distortionScale, 'value', { label: 'Distortion Scale', min: 0, max: 5 })
    folder.addBinding(sea.speedX, 'value', { label: 'Speed X', min: -3, max: 3, step: 0.01 })
    folder.addBinding(sea.speedY, 'value', { label: 'Speed Y', min: -3, max: 3, step: 0.01 })
    folder.addBinding(sea.stretchX, 'value', { label: 'Stretch X', min: 0.1, max: 5 })
    folder.addBinding(sea.stretchY, 'value', { label: 'Stretch Y', min: 0.1, max: 5 })

    folder.addBlade({ view: 'separator' })

    folder.addBinding(sea.waterColor, 'value', { label: 'Water Color', view: 'color', color: { type: 'float' } })

    folder.addBlade({ view: 'separator' })

    const normalMapParams = { file: '' }
    folder.addBinding(normalMapParams, 'file', {
      label: 'Normal Map',
      view: 'file-input',
      lineCount: 3,
      filetypes: ['.png', '.jpg', '.webp'],
      invalidFiletypeMessage: "You can only upload PNG, JPG and WebP images"
    }).on('change', async (event) => {
      if (!event.value) return

			const fileUrl = URL.createObjectURL(event.value)

      const texture = await textureLoader.load(fileUrl)
      texture.wrapS = texture.wrapT = RepeatWrapping

			sea.waterNormals.value = texture
    })
  }

  createDof(dof) {
    const dofFolder = this.pane.addFolder({
      title: 'Depth of Field',
      expanded: false,
    })

    dofFolder.addBinding(dof.focusDistance, 'value', { label: 'Focus Distance', min: 0, max: 10 })
    dofFolder.addBinding(dof.focalLength, 'value', { label: 'Focal Length', min: 2, max: 20 })
    dofFolder.addBinding(dof.bokehScale, 'value', { label: 'Bokeh Scale', min: 1, max: 20 })
  }

  createGodrays(godrays) {
    const godraysFolder = this.pane.addFolder({
      title: 'Godrays',
      expanded: false,
    })

    godraysFolder.addBinding(godrays.position, 'x', { label: 'Position X', min: -3, max: 3 })
    godraysFolder.addBinding(godrays.position, 'y', { label: 'Position Y', min: -3, max: 3 })
    godraysFolder.addBinding(godrays.position, 'z', { label: 'Position Z', min: -3, max: 3 })

    godraysFolder.addBlade({ view: 'separator' })

    godraysFolder.addBinding(godraysScaleTop, 'value', { label: 'Radius Top', min: 0.05, max: 3 })
    godraysFolder.addBinding(godraysScaleBottom, 'value', { label: 'Radius Bottom', min: 0.05, max: 3 })
    godraysFolder.addBinding(godraysScaleHeight, 'value', { label: 'Height', min: 0.05, max: 3 })

    godraysFolder.addBlade({ view: 'separator' })

    godraysFolder.addBinding(godraysOpacity, 'value', { label: 'Opacity', min: 0, max: 1 })
    godraysFolder.addBinding(godraysObstructionScale, 'value', { label: 'Obstruction Scale', min: 0, max: 1 })
    godraysFolder.addBinding(godraysNoiseScale, 'value', { label: 'Amount', min: 0, max: 3 })
    godraysFolder.addBinding(godraysTimeSpeed, 'value', { label: 'Speed', min: 0, max: 0.5 })
    godraysFolder.addBinding(godraysFresnelPower, 'value', { label: 'Fresnel Power', min: 0.1, max: 8 })

    godraysFolder.addBlade({ view: 'separator' })

    godraysFolder.addBinding(godraysColor, 'value', { label: 'Color', color: { type: 'float' } })
    godraysFolder.addBinding(godraysSmoothTop, 'value', { label: 'Smooth Top', min: 0, max: 1 })
    godraysFolder.addBinding(godraysSmoothBottom, 'value', { label: 'Smooth Bottom', min: 0, max: 1 })
  }

  createParticles(particles) {
    const particlesFolder = this.pane.addFolder({
      title: 'Particles',
      expanded: false,
    })

    particlesFolder.addBinding(particlesOpacity, 'value', { label: 'Opacity', min: 0, max: 1 })
    particlesFolder.addBinding(particleColor, 'value', { label: 'Color', color: { type: 'float' } })
    particlesFolder.addBinding(particlesNoiseStrength, 'value', { label: 'Noise Strength', min: 0, max: 1 })
    particlesFolder.addBinding(particlesSpeed, 'value', { label: 'Speed', min: 0, max: 1, step: 0.01 })
    particlesFolder.addBinding(particlesSizeMin, 'value', { label: 'Size Min', min: 0, max: 0.05, step: 0.0005 })
    particlesFolder.addBinding(particlesSizeMax, 'value', { label: 'Size Max', min: 0, max: 0.1, step: 0.0005 })
  }

  createEndDrawPlane(material) {
    const folder = this.pane.addFolder({
      title: 'End Draw Plane',
      expanded: false,
    })

    folder.addBinding(material.progress, 'value', { label: 'Progress', min: 0, max: 1 })
    folder.addBinding(material.smooth, 'value', { label: 'Smooth', min: 0, max: 1 })
    folder.addBinding(material.colorA, 'value', { label: 'Color A', color: { type: 'float' } })
    folder.addBinding(material.colorB, 'value', { label: 'Color B', color: { type: 'float' } })

    folder.addBlade({
      view: 'list',
      label: 'Shape',
      options: [
        { text: 'Male', value: 0 },
        { text: 'Female', value: 1 },
      ],
      value: material.mapIndex.value
    }).on('change', (event) => {
      material.mapIndex.value = event.value
    })
  }

  createMask() {
    const maskFolder = this.pane.addFolder({
      title: 'End Mask',
      expanded: false,
    })

    maskFolder.addBinding(maskProgress, 'value', { label: 'Progress', min: 0, max: 1 })
    maskFolder.addBinding(maskRadius, 'value', { label: 'Radius', min: 0, max: 1, step: 0.01 })
    maskFolder.addBinding(maskBorderWidth, 'value', { label: 'Border Width', min: 0, max: 0.3, step: 0.001 })
    maskFolder.addBinding(maskBorderColorA, 'value', { label: 'Border Color A', color: { type: 'float' } })
    maskFolder.addBinding(maskBorderColorB, 'value', { label: 'Border Color B', color: { type: 'float' } })
  }

  createBloom() {
    const bloomFolder = this.pane.addFolder({
      title: 'Postprocess - Bloom',
      expanded: false,
    })

    bloomFolder.addBinding(bloomThreshold, 'value', { label: 'Threshold', min: 1, max: 2, step: 0.01 })
    bloomFolder.addBinding(bloomStrength, 'value', { label: 'Strength', min: 0, max: 3, step: 0.01 })
    bloomFolder.addBinding(bloomRadius, 'value', { label: 'Radius', min: 0, max: 1.5, step: 0.01 })
  }

  createLUT() {
    const lutFolder = this.pane.addFolder({
      title: 'Postprocess - LUT',
      expanded: false,
    })

    lutFolder.addBinding(lutIntensity, 'value', { label: 'Intensity', min: 0, max: 1, step: 0.01 })
  }
}
