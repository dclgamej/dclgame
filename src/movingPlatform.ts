import * as utils from '@dcl/ecs-scene-utils'

export function createMoving(
  model: GLTFShape,
  transform: Transform,
  startPos: Vector3,
  endPos: Vector3,
  time: number
): Entity {
  const entity = new Entity()
  engine.addEntity(entity)
  entity.addComponent(model)
  entity.addComponent(transform)

  // Move the platform back and forth between start and end positions
  entity.addComponent(
    new utils.ToggleComponent(
      utils.ToggleState.Off,
      (value: utils.ToggleState) => {
        if (value === utils.ToggleState.On) {
          entity.addComponentOrReplace(
            new utils.MoveTransformComponent(startPos, endPos, time, () => {
              entity.getComponent(utils.ToggleComponent).toggle()
            })
          )
        } else {
          entity.addComponentOrReplace(
            new utils.MoveTransformComponent(endPos, startPos, time, () => {
              entity.getComponent(utils.ToggleComponent).toggle()
            })
          )
        }
      }
    )
  )
  entity.getComponent(utils.ToggleComponent).toggle()
  return entity
}
