
import * as utils from '@dcl/ecs-scene-utils'



// Power base where the power cube sits
export class PowerBase extends Entity {
  constructor(model: GLTFShape, transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)

  }


}
