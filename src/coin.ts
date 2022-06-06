import * as utils from '@dcl/ecs-scene-utils'
import { currentPlayerId } from './trackPlayers'
import { sceneMessageBus } from './messageBus'
import { getEntityWithId, SyncId } from './syncId'
/**
 * Sound is a separated from the coin entity so that you can
 * still hear it even when the coin is removed from the engine.
 */
const coinPickupSound = new Entity()
coinPickupSound.addComponent(new Transform())
engine.addEntity(coinPickupSound)
coinPickupSound.setParent(Attachable.AVATAR)
coinPickupSound.addComponent(
  new AudioSource(new AudioClip('sounds/coinPickup.mp3'))
)
engine.addEntity(coinPickupSound)

export function createCoin(
  id: string,
  model: GLTFShape,
  transform: Transform,
  triggerShape: utils.TriggerBoxShape
): Entity {
  const entity = new Entity()
  engine.addEntity(entity)
  entity.addComponent(new SyncId(id))
  entity.addComponent(model)
  entity.addComponent(transform)

  // Create trigger for coin
  entity.addComponent(
    new utils.TriggerComponent(triggerShape, {
      onCameraEnter: () => {
        // Camera enter
        entity.getComponent(Transform).scale.setAll(0)
        coinPickupSound.getComponent(AudioSource).playOnce()

      },
      onCameraExit: () => {
        // Camera exit
        let playerdata = {dataid:entity.getComponent(SyncId).id, pl:currentPlayerId}
        sceneMessageBus.emit("earn", playerdata)


      },
    })
  )
  return entity
}
