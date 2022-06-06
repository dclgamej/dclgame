import * as utils from "@dcl/ecs-scene-utils"


export let Config = {
  TIMER_ARENA : 280
}

const clapMeterNeedle = new Entity()

export class ClapMeter extends Entity {
  constructor(transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(new GLTFShape("models/circle.glb"))
    this.addComponent(transform)

    // Clap meter needle
    clapMeterNeedle.addComponent(new GLTFShape("models/clapMeterNeedle.glb"))
    clapMeterNeedle.addComponent(new Transform({ position: new Vector3(0, 0.05, 0) }))
    clapMeterNeedle.setParent(this)

    // Set needle to start angle
    clapMeterNeedle.getComponent(Transform).rotation.setEuler(0, 0, Config.TIMER_ARENA)
   }
  }
