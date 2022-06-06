import { LeaderBoard, buildLeaderBoard } from './leaderBoard'
import * as utils from '@dcl/ecs-scene-utils'
import * as ui from '@dcl/ui-scene-utils'
import { getUserData} from "@decentraland/Identity"
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { currentPlayerId } from './trackPlayers'
import { getEntityWithId, SyncId } from './syncId'
import { createCoin } from './coin'
import { PowerBase } from './powerBase'
import { BorderBase } from './border'
import { createMoving } from './movingPlatform'
import { MintMachine } from './mintMachine'


const borderSpawnes = [
  [16, 0, 63.7,0],
  [32, 0, 63.7,0],
  [48, 0, 63.7,0],
  [63.7, 0, 63.7,1],
  [63.7, 0, 16,1],
  [63.7, 0, 32,1],
  [63.7, 0, 48,1],
  [.3, 0, 32,1],
  [.3, 0, 48,1],
  [.3, 0, 63.7,0],
  [32, 0, .3,0],
  [48, 0, .3,0],
  [63.7, 0, .3,-1],
  [.3, 0, 63.7,1],
  [16, 0, .3,0]
]
for (let b = 0; b < (borderSpawnes.length-2); b++) {

   new BorderBase(
    new GLTFShape('models/border.glb'),
    new Transform(new Transform({ position: new Vector3(borderSpawnes[b][0],borderSpawnes[b][1],borderSpawnes[b][2]),
    rotation: new Quaternion(0, 0, 0, 0),
    scale: new Vector3(1, 2, 1) }))
  )

}

for (let r = 0; r < borderSpawnes.length; r++) {
if (borderSpawnes[r][3] != -1) {
  new PowerBase(
    new GLTFShape('models/field.glb'),
    new Transform(new Transform({ position: new Vector3(borderSpawnes[r][0],borderSpawnes[r][1],borderSpawnes[r][2]),
    rotation: new Quaternion(0, borderSpawnes[r][3], 0, borderSpawnes[r][3]),
    scale: new Vector3(1, 2, 1) }))
  )
}
}


const map = new PowerBase(
  new GLTFShape('models/map10.glb'),
  new Transform(new Transform({ position: new Vector3(32, 0.2, 32),
  rotation: new Quaternion(0, 1, 0, 0),
  scale: new Vector3(2.64, 2.64, 2.64) }))
)



const powerBase0 = new PowerBase(
  new GLTFShape('models/field.glb'),
  new Transform(new Transform({ position: new Vector3(.3, 0, 16),
  rotation: new Quaternion(0, 1, 0, 1),
  scale: new Vector3(.55, 3.56, 1) }))
)

const powerBase4 = new PowerBase(
  new GLTFShape('models/field.glb'),
  new Transform(new Transform({ position: new Vector3(7, 0, .3),
  rotation: new Quaternion(0, 0, 0, 0),
  scale: new Vector3(.55, 3.56, 1) }))
)

const powerBase1 = new PowerBase(
  new GLTFShape('models/field.glb'),
  new Transform(new Transform({ position: new Vector3(0, 0, 16),
  rotation: new Quaternion(0, 0, 0, 0),
  scale: new Vector3(1, 3.56, 1) }))
)

const powerBase2 = new PowerBase(
  new GLTFShape('models/field.glb'),
  new Transform(new Transform({ position: new Vector3(16, 0, 16),
  rotation: new Quaternion(0, 1, 0, 1),
  scale: new Vector3(1, 3.56, 1)
   }))
)


// Configuration
const Z_OFFSET = 1.5
const GROUND_HEIGHT = 0.55

export let game_status = 'ungamed';
export let player_sync = 'Sync No';
export let  text_status = 'ungamed';
export let player_status = 'unregister';





// UI
let syncIcon =   new ui.MediumIcon('icons/yes.png', -137, 15, 32,32,{
  sourceHeight: 64,
  sourceWidth: 64,
  sourceLeft: 128,
  sourceTop: 0
})
let nosyncIcon = new ui.MediumIcon('icons/yes.png', -137, 15, 32,32,{
  sourceHeight: 64,
  sourceWidth: 64,
  sourceLeft: 194,
  sourceTop: 0
})

let noGame =   new ui.MediumIcon('icons/yes.png', -70, 15, 32,32,{
  sourceHeight: 64,
  sourceWidth: 64,
  sourceLeft: 258,
  sourceTop: 0
})
let waitGame = new ui.MediumIcon('icons/yes.png', -70, 15, 32,32,{
  sourceHeight: 64,
  sourceWidth: 64,
  sourceLeft: 64,
  sourceTop: 0
})

let yesGame =   new ui.MediumIcon('icons/yes.png', -70, 15, 32,32,{
  sourceHeight: 64,
  sourceWidth: 64,
  sourceLeft: 0,
  sourceTop: 0
})

let winGame =   new ui.MediumIcon('icons/yes.png', -70, 15, 32,32,{
  sourceHeight: 64,
  sourceWidth: 64,
  sourceLeft: 320,
  sourceTop: 0
})


nosyncIcon.show()
syncIcon.hide()
noGame.show()
waitGame.hide()
yesGame.hide()
winGame.hide()

let syncLabel  = new ui.CornerLabel('No Sync',-105,40,Color4.White(),13, true)
let gameLabel  = new ui.CornerLabel('No Game',-35,40,Color4.White(),13, true)
let coinsLabel = new ui.CornerLabel('Coins',-165,40,Color4.White(),13, true)
let coinText   = new ui.CornerLabel('-',-165,10,Color4.White(),23, true)


async function updateIcon(showIcon: string) {
  noGame.hide()
  waitGame.hide()
  yesGame.hide()
  winGame.hide()

  if (showIcon == 'noGame')     {noGame.show(); text_status = 'No Game';}
  if (showIcon == 'waitGame')   {waitGame.show(); text_status = 'Wait Game';}
  if (showIcon == 'yesGame')    {yesGame.show(); text_status = 'Yes Game';}
  if (showIcon == 'winGame')    {winGame.show(); text_status = 'Win Game';}
    gameLabel.set(text_status)
}


async function updateSync(showIcon: string) {
  nosyncIcon.hide()
  syncIcon.hide()
  if (showIcon == 'nosyncIcon') {nosyncIcon.show(); player_sync = 'Sync No'}
  if (showIcon == 'syncIcon')   {syncIcon.show(); player_sync = 'Sync Yes'}

  syncLabel.set(player_sync)
}

async function updateButtom(showIcon: string) {
  tboxy.getComponent(Transform).scale.setAll(0)
  tboxt.getComponent(Transform).scale.setAll(0)
  tboxs.getComponent(Transform).scale.setAll(0)

  if (showIcon == 'y')   {  tboxy.getComponent(Transform).scale.setAll(1)}
  if (showIcon == 'r')   {  tboxt.getComponent(Transform).scale.setAll(1)}
  if (showIcon == 'g')   {  tboxs.getComponent(Transform).scale.setAll(1)}

}

async function updateReward(showIcon: string) {

  if (showIcon == 'g')   {  tboxw.getComponent(Transform).scale.setAll(0)}
  if (showIcon == 'w')   {  tboxw.getComponent(Transform).scale.setAll(1)}


}




let sessionActive: boolean = false
let readyToPlay: boolean = true





const coinShape = new GLTFShape('models/coin.glb') // Includes the spinning animation

// Contains the positions for each coin


const triggerBoxShape = new utils.TriggerBoxShape(
  new Vector3(1.5, 3, 1.5),
  new Vector3(0, 1, 0)
) // Trigger shape for coin

// Moving platform
createMoving(
  new GLTFShape('models/plat0.glb'),
  new Transform({ position: new Vector3(12.1, 1, 12.1)}),
  new Vector3(12.1, 1, 12.1),
  new Vector3(12.1, 9, 12.1),
  5
)



// Adding base scene models
const tbox = new Entity()
tbox.addComponent(new GLTFShape('models/build.glb'))
tbox.addComponent(
  new Transform({
    position: new Vector3(8.1, 0, 8.1),
    rotation: new Quaternion(0, 1, 0, 1),
    scale: new Vector3(2.66, 2.66, 2.66)
  })
)
engine.addEntity(tbox)

// -------------- win box -------------------


// Adding base scene models
const topbox = new Entity()
topbox.addComponent(new GLTFShape('models/win.glb'))
topbox.addComponent(
  new Transform({
    position: new Vector3(13, 16.9, 13),
    rotation: new Quaternion(0, .25, 0, -0.1),
    scale: new Vector3(1, 1, 1)
  })
)
engine.addEntity(topbox)

const mintBox4 = new MintMachine(
  'ui4',
  new Transform(new Transform({
    position: new Vector3(13, 16.9, 13),
    rotation: new Quaternion(0, .25, 0, -0.1),
    scale: new Vector3(1, 1, 1)
})
)
)

// --------------------- how to btn





// --------------------- winner portal






// Adding base scene models
const tboxr = new Entity()
tboxr.addComponent(new GLTFShape('models/box_r.glb'))
tboxr.addComponent(
  new Transform({
    position: new Vector3(4, 0.3, 14),
    rotation: new Quaternion(0, -1, 0, 0),
    scale: new Vector3(1, 1, 1)
  })
)
engine.addEntity(tboxr)



const mintBox3 = new MintMachine(
  'ui3',
  new Transform(new Transform({
    position: new Vector3(4, 0.3, 14),
    rotation: new Quaternion(0, -1, 0, 0),
    scale: new Vector3(1, 1, 1)
})
)
)

// Adding base scene models
const infobox = new Entity()
infobox.addComponent(new GLTFShape('models/inf.glb'))
infobox.addComponent(
  new Transform({
    position: new Vector3(14,.3,14),
  rotation: new Quaternion(0, .25, 0, -0.1),
    scale: new Vector3(1, 1, 1)
  })
)
engine.addEntity(infobox)

const mintBox2 = new MintMachine(
  'ui2',
  new Transform(new Transform({
    position: new Vector3(14,.3,14),
  rotation: new Quaternion(0, .25, 0, -0.1),
  scale: new Vector3(1, 1, 1)
})
)
)


// Adding base scene models
const rewardbox = new Entity()
rewardbox.addComponent(new GLTFShape('models/box_r.glb'))
rewardbox.addComponent(
  new Transform({
    position: new Vector3(14, 0.3, 4),
    rotation: new Quaternion(0, -1, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
)
engine.addEntity(rewardbox)

const mintBox1 = new MintMachine(
  'ui1',
  new Transform(new Transform({
    position: new Vector3(14, 0.3, 4),
    rotation: new Quaternion(0, -1, 0, 1),
    scale: new Vector3(1, 1, 1)
})
)
)


const crc = new Entity()
crc.addComponent(new GLTFShape('models/circle4.glb'))
crc.addComponent(
  new Transform({
    position: new Vector3(8, 4.1, 15.6),
    rotation: new Quaternion(-1, 0, 0, 1),
    scale: new Vector3(1.4, 1.4, 1.4)
  })
)
engine.addEntity(crc)

const tbl = new Entity()
tbl.addComponent(new GLTFShape('models/table_r.glb'))
tbl.addComponent(
  new Transform({
    position: new Vector3(16, 4.75, 7),
    rotation: new Quaternion(0, 0, 1, 1),
    scale: new Vector3(1.2, 1.2, 1.2)
  })
)
engine.addEntity(tbl)





/// --- Spawner function ---



/// --- Create message bus ---
const sceneMessageBus = new MessageBus()

/// --- Define a custom type to pass in messages ---
type NewBoxPosition = {
  position: ReadOnlyVector3
}






function spawnCoin() {
  const coinplace: NewBoxPosition = {
    position: {
      x: 16 + (Math.random() * 39 + 1),
      y: Math.random() * 28,
      z: 16 + (Math.random() * 39 + 1),
    },
  }
//  log('New coin Drop')
  sceneMessageBus.emit("drop", coinplace)

}


let physicsCast = PhysicsCast.instance
let coin_id=0;
/// --- Receive messages ---
sceneMessageBus.on("drop", (info: NewBoxPosition) => {
  //cube.getComponent(Transform).scale.z *= 1.1
  //cube.getComponent(Transform).scale.x *= 0.9
  const coinPositions = [
    new Vector3(info.position.x, info.position.y, info.position.z)
  ]



  for (const coinPosition of coinPositions) {
    coin_id ++
    let coin_name = 'coin'+coin_id
    //log('triggerBoxShape',coin_name)


    let direction = new Vector3(0, -1, 0)

    let ray: Ray = {
      origin: coinPosition,
      direction: direction,
      distance: 30,
    }

  let newSpawnPos = new Vector3(0, 0, 0)
        physicsCast.hitFirst(
          ray,
          (e) => {

            newSpawnPos.x = e.hitPoint.x;
            newSpawnPos.y = e.hitPoint.y+1;
            newSpawnPos.z = e.hitPoint.z;

                createCoin(
                  coin_name,
                  coinShape,
                  new Transform({ position: newSpawnPos }),
                  triggerBoxShape
                )

          },
          0
        )



  }


})








const clapMeterNeedle = new Entity()

class ClapMeter extends Entity {
  constructor(transform: Transform) {
    super()
    engine.addEntity(this)

    this.addComponent(transform)

    // Clap meter needle
    clapMeterNeedle.addComponent(new GLTFShape("models/clapMeterNeedle.glb"))
    clapMeterNeedle.addComponent(new Transform({ position: new Vector3(0, 0.05, 0) }))
    clapMeterNeedle.setParent(this)

    // Set needle to start angle
    clapMeterNeedle.getComponent(Transform).rotation.setEuler(0, 0, 0)
   }
  }




  var socket = new WebSocket("wss://wssserver3000.herokuapp.com");



/*
socket.onopen = (ev) => {
  socket.send(
    JSON.stringify({ event: "bts:subscribe",
    data: {
        channel: "live_trades_btcusd"
    } })
  );
};
*/






executeTask(async () => {
  let myPlayer = await getUserData()

  onEnterSceneObservable.add((player) => {
    //log("player entered scene: ", player.userId)
    if (player.userId === myPlayer?.userId) {
      //log("I entered the scene!", game_status,player_status,player_sync)
         if ((game_status=='Arena Time') && ( player_status == 'imgame') && (player_sync = 'Sync Yes')) {
           //log('players no stat')
         } else {
           //log('players')

           player_status = 'unregister'
         }


    }
  })

  onLeaveSceneObservable.add((player) => {
    //log("player left scene: ", player.userId)
    if (player.userId === myPlayer?.userId) {
      //log("I left the scene!")
      player_status = 'unregister'
    }
  })
})








onPlayerConnectedObservable.add((player) => {
  //log("player entered: ", player.userId)
})

onPlayerDisconnectedObservable.add((player) => {
  //log("player left: ", player.userId)
})






const clapMeterBoard = new ClapMeter(new Transform({position: new Vector3(8, 4, 15) }))
const blockLeaderBoard = new LeaderBoard('Start')


let status: string = 'waiting'




let PlayerList:any[] = [];
//let PlayerList[] = 0;

// Multiplayer Table Registred
function clearCoins() {
  //log('swapppp')
  coin_id=0;
  for (let c = 0; c < 130; c++) {
    let coin_names = 'coin'+c
    //log('coins', coin_names)
    const beer: Entity = getEntityWithId(coin_names) as Entity
    if (!beer) continue
    engine.removeEntity(beer)
    //log('remove', coin_names)

    }
  }




function regPlayer(playername: string) {
    //log(playername)
    let PlayerScore = {name:playername,score: 0}
    PlayerList.push(PlayerScore)
    //PlayerList[playername] = PlayerScore
    //log('PlayerList', PlayerList)
    let listh = PlayerList.length
    playersInfo.getComponent(TextShape).value = listh.toString()
}

const boardParent = new Entity()
boardParent.addComponent(
  new Transform(
    new Transform({
      position: new Vector3(15, 4.5, 7),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  )
)
engine.addEntity(boardParent)

async function getScoreBoard() {
  try {
  //  //log('json Playerlist', PlayerList)
    return PlayerList
  } catch (e) {
    //log('error fetching scores from server ', e)
  }
}

async function updateBoard() {

  let scoreData: any = await getScoreBoard() // data.scoreBoard
  log('updateBoard', scoreData)
 buildLeaderBoard(scoreData, boardParent, 9).catch((error) => log(error))
}

// update board every 2 seconds
blockLeaderBoard.addComponent(
  new utils.Interval(2000, () => {
    updateBoard().catch((error) => log(error))
  })
)

// update leader board
updateBoard().catch((error) => log(error))




const timerString = new Entity()
const textTimer = new TextShape('0:0')

textTimer.fontSize = 10
textTimer.color = Color3.White()
textTimer.font = new Font(Fonts.SansSerif)
textTimer.hTextAlign = "top"
textTimer.vTextAlign = "center"
textTimer.width= 0
textTimer.height= 10
textTimer.paddingTop= 0
textTimer.paddingRight= 0
textTimer.paddingBottom= 6

timerString.addComponent(textTimer)
timerString.addComponent(
  new Transform({
    position: new Vector3(16, 2.5, 12),
    rotation: new Quaternion(0, 90, 0, 90),
    scale: new Vector3(1, 1, 1)
  })
)
engine.addEntity(timerString)


const playersInfo = new Entity()
const numPlayer = new TextShape('0')

numPlayer.fontSize = 20
numPlayer.color = Color3.White()
numPlayer.font = new Font(Fonts.SansSerif)
numPlayer.hTextAlign = "top"
numPlayer.vTextAlign = "center"
numPlayer.width= 0
numPlayer.height= 10
numPlayer.paddingTop= 0
numPlayer.paddingRight= 0
numPlayer.paddingBottom= 4

playersInfo.addComponent(numPlayer)
playersInfo.addComponent(
  new Transform({
    position: new Vector3(16, 3.5, 3),
    rotation: new Quaternion(0, 90, 0, 90),
    scale: new Vector3(1, 1, 1)
  })
)
engine.addEntity(playersInfo)





const tboxy = new Entity()
tboxy.addComponent(new GLTFShape('models/top_y.glb'))
tboxy.addComponent(
  new Transform({
    position: new Vector3(4, 0.3, 14),
    rotation: new Quaternion(0, -1, 0, 0),
    scale: new Vector3(1, 1, 1)
  })
)

tboxy.addComponent(
  new OnPointerDown(
    (e) => {
      //log("Station clicked", e)


      if (status == 'waiting') {  status='gamebegin'}

       // light fire
      //log('register_to_arena',game_status,player_sync,player_status)
      if ((game_status == 'Register Time') && (player_sync = 'Sync Yes') ){
      if (player_status == 'register') {
        executeTask(async () => {
          let data:any = await getUserData()
          let username = data.displayName
          sceneMessageBus.emit("spawn", username.toString())
        })
        player_status = 'register_arena'
        updateIcon('yesGame')
        updateButtom('g')

      }


     }
    },
    {
      button: ActionButton.PRIMARY,
      showFeedback: true,
      hoverText: "Activate",
      distance: 8,
    }
  )
)

engine.addEntity(tboxy)

const tboxt = new Entity()
tboxt.addComponent(new GLTFShape('models/top_r.glb'))
tboxt.addComponent(
  new Transform({
    position: new Vector3(4, 0.3, 14),
    rotation: new Quaternion(0, -1, 0, 0),
    scale: new Vector3(0, 0, 0)
  })
)


engine.addEntity(tboxt)





const tboxs = new Entity()
tboxs.addComponent(new GLTFShape('models/top_g.glb'))
tboxs.addComponent(
  new Transform({
    position: new Vector3(4, 0.3, 14),
    rotation: new Quaternion(0, -1, 0, 0),
    scale: new Vector3(0, 0, 0)
  })
)
engine.addEntity(tboxs)


const tboxw = new Entity()
tboxw.addComponent(new GLTFShape('models/top_w.glb'))
tboxw.addComponent(
  new Transform({
    position: new Vector3(14, 0.3, 4),
    rotation: new Quaternion(0, -1, 0, 1),
    scale: new Vector3(0, 0, 0)
  })
)


tboxw.addComponent(
  new OnPointerDown(
    (e) => {
      movePlayerTo( { x: 3, y: 22, z: 3 })
    },
    {
      button: ActionButton.PRIMARY,
      showFeedback: true,
      hoverText: "Get Reward",
      distance: 8,
    }
  )
)

engine.addEntity(tboxw)











/// --- Receive messages ---
sceneMessageBus.on("spawn", (playername: string) => {
 regPlayer(playername)
})

sceneMessageBus.on('earn', (playerdata: any) => {
  const beer: Entity = getEntityWithId(playerdata.dataid) as Entity

  if (!beer) return


  for (let i = 0; i < PlayerList.length; i++) {


    if (PlayerList[i].name == playerdata.pl) {

      PlayerList[i].score = PlayerList[i].score + 1

      if (playerdata.pl == currentPlayerId) {coinText.set(PlayerList[i].score)}
    }
  }


  engine.removeEntity(beer)
})


let timerstep: number = 1


export class UpdateScore implements ISystem {
  update(dt: number) {
    if (timerstep > 0) {
     timerstep -= dt
   } else {
     timerstep = 1
     //log(game_status)

     if (player_status == 'unregister'){
       movePlayerTo( { x: 8, y: 1, z: 8 })
       player_status = 'register'
       updateSync('nosyncIcon')
       updateIcon('noGame')
       PlayerList=[]
       updateButtom('r')

     }

     if ((game_status=='Sync Time') && ( player_status == 'register') ) {
       coinText.set('0')
     player_status = 'register'
     updateSync('syncIcon')
     updateIcon('noGame')
     PlayerList=[]
     updateButtom('r')
     }

     if ((game_status=='Register Time') && ( player_status == 'register')) {
        coinText.set('0')
       if (player_sync == 'Sync Yes') {
           updateIcon('waitGame')
           updateButtom('y')
       } else {
         updateButtom('r')
         updateSync('nosyncIcon')
         updateIcon('noGame')

       }
     }

     if ((game_status=='Arena Time') && ( player_status == 'register_arena')) {

       clearCoins()
        movePlayerTo( { x: 32, y: 18, z: 32 },{ x: 1, y: 0, z: 1 })
        player_status = 'imgame'
        //log('gamebegin')
     }

     if ((game_status=='Reward Time') && ( player_status == 'imgame')) {
       clearCoins()
       movePlayerTo( { x: 12, y: 0, z: 12 })
       let topscore = 0
       let winner = 'name'

       for (let i = 0; i < PlayerList.length; i++) {

         if (PlayerList[i].score > topscore) {
           winner = PlayerList[i].name
         }
       }

           if (winner == currentPlayerId) {
           updateReward('w')
         }
         player_status = 'register'
         updateButtom('r')
         updateSync('nosyncIcon')
         updateIcon('noGame')

         }


  //  log('x', player_status)

   }


  }
}

engine.addSystem(new UpdateScore())


socket.onmessage = function (event) {
  try {
    const parsed = JSON.parse(event.data);
    //log('wss')
    const toDate = new Date(parsed)
    //log('dates', toDate.getMinutes() , toDate.getSeconds())
    let arena_stage = toDate.getMinutes() +':'+ toDate.getSeconds();
    timerString.getComponent(TextShape).value = arena_stage.toString();
    let roundtime = Number((toDate.getMinutes() % 2) * 60 + toDate.getSeconds())
    ////log('roundtime', roundtime)F
    clapMeterNeedle.getComponent(Transform).rotation.setEuler(0, 0, roundtime*3)
    if (roundtime <= 20) {game_status = 'Reward Time'

}
    if ((roundtime > 20) && (roundtime <= 40)) {game_status = 'Sync Time'

}
    if (roundtime == 60) { clearCoins() }
    if ((roundtime > 40) && (roundtime <= 60)) {game_status = 'Register Time'

}
    if ((roundtime > 60) && (roundtime <= 120)) {
      game_status = 'Arena Time'
      if (player_status=='imgame') {
        spawnCoin()
      }
  }


    /*
    if (roundtime <= 60) {game_status = 'Reward Time'}
    if ((roundtime > 60) && (roundtime <= 120)) {game_status = 'Sync Time'}
    if ((roundtime > 120) && (roundtime <= 180)) {game_status = 'Register Time'}
    if ((roundtime > 180) && (roundtime <= 360)) {game_status = 'Arena Time'}
    */
    blockLeaderBoard.getComponent(TextShape).value = game_status;

  } catch (error) {
    //log(error)
  }
};
