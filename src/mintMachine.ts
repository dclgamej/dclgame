import * as utils from '@dcl/ecs-scene-utils'
import * as ui from '@dcl/ui-scene-utils'
//import { minting } from './Minter'


// popup 1


let prompt1 = new ui.CustomPrompt(ui.PromptStyles.DARK, 512,512, true)
prompt1.addIcon('images/ui1.png', 0, 175, 512, 280)
prompt1.addText('How to win?', 0, -5, Color4.Yellow(), 40)
prompt1.addText("Prize floor", 0, 70, Color4.White(), 10)
prompt1.addText("One winner, who collect max coins", 0, -40, Color4.White(), 15)
prompt1.addText("in round take first place", 0, -65, Color4.White(), 15)
prompt1.addText("and get portal to the floor of the winners!", 0, -90, Color4.White(), 15)
prompt1.addText("Lets go!", 0, -115, Color4.Yellow(), 15)

let button1 = prompt1.addButton(
  'Close',
  0,
  -200,
  () => {
    prompt1.hide()
  },
  ui.ButtonStyles.F
)

// popup 2


let prompt2 = new ui.CustomPrompt(ui.PromptStyles.DARK, 512,512, true)
prompt2.addIcon('images/ui2.png', 0, 175, 512, 280)
prompt2.addText('How to play', 0, -5, Color4.Yellow(), 40)
prompt2.addText("Gameplay", 0, 70, Color4.White(), 10)
prompt2.addText("Collect coins on the round map.", 0, -40, Color4.White(), 15)
prompt2.addText("the player who collects the most coins", 0, -65, Color4.White(), 15)
prompt2.addText("its round's winner and get access to the prize floor.", 0, -90, Color4.White(), 15)
prompt2.addText("Good Luck!", 0, -115, Color4.Yellow(), 15)

let button2 = prompt2.addButton(
  'Close',
  0,
  -200,
  () => {
    prompt2.hide()
  },
  ui.ButtonStyles.F
)


// popup 3


let prompt3 = new ui.CustomPrompt(ui.PromptStyles.DARK, 512,512, true)
prompt3.addIcon('images/ui3.png', 0, 175, 512, 280)
prompt3.addText('Rounds Wheel', 0, -5, Color4.Yellow(), 40)
prompt3.addText("Information", 0, 70, Color4.White(), 10)
prompt3.addText("Each round starts every few minutes.", 0, -40, Color4.White(), 15)
prompt3.addText("To Sync, you must be in percel in Sync Time.", 0, -65, Color4.White(), 15)
prompt3.addText("Registration will available only for sync players.", 0, -90, Color4.White(), 15)
prompt3.addText("Good Luck!", 0, -115, Color4.Yellow(), 15)

let button3 = prompt3.addButton(
  'Close',
  0,
  -200,
  () => {
    prompt3.hide()
  },
  ui.ButtonStyles.F
)


// popup 3


let prompt4 = new ui.CustomPrompt(ui.PromptStyles.DARK, 512,512, true)
prompt4.addIcon('images/ui4.png', 0, 175, 512, 280)
prompt4.addText('You are a winner!', 0, -5, Color4.Yellow(), 40)
prompt4.addText("Congratulations", 0, 70, Color4.White(), 10)
prompt4.addText("This game was made for DCL GAMEJAM", 0, -40, Color4.White(), 15)
prompt4.addText("in real case the game's", 0, -65, Color4.White(), 15)
prompt4.addText("prize will be POAP token.", 0, -90, Color4.White(), 15)
prompt4.addText("Thanks for playing!", 0, -115, Color4.Yellow(), 15)

let button4 = prompt4.addButton(
  'Close',
  0,
  -200,
  () => {
    prompt4.hide()
  },
  ui.ButtonStyles.F
)




// Power base where the power cube sits
export class MintMachine extends Entity {
  constructor(board: String, transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(new GLTFShape('models/infob.glb'))
    this.addComponent(transform)

    this.addComponent(
      new OnPointerDown(
        (e) => {
        if (board == 'ui1')  prompt1.show()
        if (board == 'ui2')  prompt2.show()
        if (board == 'ui3')  prompt3.show()
        if (board == 'ui4')  prompt4.show()
        },
        {
          button: ActionButton.PRIMARY,
          showFeedback: true,
          hoverText: "Read Info",
          distance: 8,
        }
      )
    )
  }
}
