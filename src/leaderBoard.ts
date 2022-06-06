const TiltleFont = new Font(Fonts.SanFrancisco_Heavy)
const SFFont = new Font(Fonts.SanFrancisco)

export enum TextTypes {
  BIGTITLE = 'bigtitle',
  BIGVALUE = 'bigvalue',
  TITLE = 'title',
  LABEL = 'label',
  VALUE = 'value',
  UNIT = 'unit',
  TINYVALUE = 'tinyvalue',
  TINYTITLE = 'tinytitle'
}

export class LeaderBoard extends Entity {
  constructor(
    text: string
  )  {
      super()
      engine.addEntity(this)

      this.addComponent(
        new Transform({
          position: new Vector3(15, 1.5, 7),
          rotation: new Quaternion(0, 90, 0, 90),
          scale: new Vector3(1, 1, 1)
        })
      )

      const shape = new TextShape(text)

      shape.width = 15
      const boardText = new TextShape("Welcome to Game")
      boardText.fontSize = 5
      boardText.color = Color3.White()
      boardText.font = new Font(Fonts.SansSerif)
      boardText.hTextAlign = "top"
      boardText.vTextAlign = "center"
      boardText.width= 0
      boardText.height= 12
      boardText.paddingTop= 0
      boardText.paddingRight= 0
      boardText.paddingBottom= 9


      this.addComponent(boardText)
    }


  }


  export class ScoreBoardText extends Entity {
    constructor(
      type: TextTypes,
      text: string,
      transform: TranformConstructorArgs,
      parent: Entity
    ) {
      super()
      engine.addEntity(this)

      this.addComponent(new Transform(transform))
      this.setParent(parent)

      const shape = new TextShape(text)

      shape.width = 10

      switch (type) {
        case TextTypes.BIGTITLE:
          shape.fontSize = 2
          shape.color = Color3.White()
          shape.vTextAlign = 'center'
          shape.font = TiltleFont
          break
        case TextTypes.BIGVALUE:
          shape.fontSize = 3
          shape.color = Color3.Green()
          shape.vTextAlign = 'center'
          shape.font = TiltleFont
          break

        case TextTypes.TITLE:
          shape.fontSize = 3
          shape.color = Color3.White()
          shape.vTextAlign = 'center'
          shape.width = 10
          shape.font = TiltleFont
          break
        case TextTypes.TINYTITLE:
          shape.fontSize = 2
          shape.color = Color3.White()
          shape.vTextAlign = 'center'
          shape.width = 10
          shape.font = SFFont
          break
        case TextTypes.LABEL:
          shape.fontSize = 3
          shape.color = Color3.White()
          shape.vTextAlign = 'left'
          shape.font = SFFont
          break
        case TextTypes.VALUE:
          shape.fontSize = 3
          shape.color = Color3.Green()
          shape.vTextAlign = 'right'
          shape.font = SFFont
          break
        case TextTypes.TINYVALUE:
          shape.fontSize = 2
          shape.color = Color3.Green()
          shape.vTextAlign = 'right'
          shape.font = SFFont
          break

        case TextTypes.UNIT:
          shape.fontSize = 2
          shape.color = Color3.White()
          shape.vTextAlign = 'right'
          shape.font = SFFont
          break
      }

      this.addComponent(shape)
    }
  }

  const scoreBoardNames: ScoreBoardText[] = []
  const scoreBoardValues: ScoreBoardText[] = []

  export async function buildLeaderBoard(
    scoreData: any[],
    parent: Entity,
    length: number
  ) {

    if (scoreBoardNames.length === 0) {

      const nameTitle = new ScoreBoardText(
        TextTypes.BIGTITLE,
        'Player',
        {
          position: new Vector3(-0.8, 0.65, 0)
        },
        parent
      )

      const scoreTitle = new ScoreBoardText(
        TextTypes.BIGTITLE,
        'Score',
        {
          position: new Vector3(0.8, 0.65, 0)
        },
        parent
      )

      for (let i = 0; i < length; i++) {
        if (i < scoreData.length) {
          const name = new ScoreBoardText(
            TextTypes.TINYTITLE,
            scoreData[i].name,
            {
              position: new Vector3(-0.6, 0.2 - i / 4, 0)
            },
            parent
          )
          scoreBoardNames.push(name)

          const score = new ScoreBoardText(
            TextTypes.TINYVALUE,
            scoreData[i].score.toString(),
            {
              position: new Vector3(0.6, 0.2 - i / 4, 0)
            },
            parent
          )
          scoreBoardValues.push(score)
        } else {
          // create empty line

          const name = new ScoreBoardText(
            TextTypes.TINYTITLE,
            '-',
            {
              position: new Vector3(-0.6, 0.2 - i / 4, 0)
            },
            parent
          )
          scoreBoardNames.push(name)

          const score = new ScoreBoardText(
            TextTypes.TINYVALUE,
            '-',
            {
              position: new Vector3(0.6, 0.2 - i / 4, 0)
            },
            parent
          )
          scoreBoardValues.push(score)
        }
      }
    } else {

      // update existing board
      for (let i = 0; i < length; i++) {

        if (i > scoreData.length) continue
    
          scoreBoardNames[i].getComponent(TextShape).value = '-'
          scoreBoardValues[i].getComponent(TextShape).value = '-'

      }
    }
  }





//const scoreBoardNames: ScoreBoardText[] = []
//const scoreBoardValues: ScoreBoardText[] = []
