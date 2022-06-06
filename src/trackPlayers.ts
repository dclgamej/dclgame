import { getUserData } from '@decentraland/Identity'

export let currentPlayerId: string
export let currentPlayerAddress: string
void executeTask(async () => {
  const user = await getUserData()
  if (!user) return
  log(user)
  currentPlayerId = user.displayName
  currentPlayerAddress = user.userId
})
