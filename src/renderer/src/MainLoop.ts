/* eslint-disable prettier/prettier */

import { Notify } from './components/notify'
import { Friends, TrackedUser, TrackedUsers, UserPresences } from './types/RobloxApi'

const GetPresence = async (
  UserIds: number[],
  cookie: string
): Promise<UserPresences | undefined> => {
  return window.electron.ipcRenderer
    .invoke('fetchPresences', UserIds, cookie)
    .then((UserPresences: UserPresences) => {
      if (!UserPresences) {
        console.error('Failed to fetch user presences')
        return undefined
      }
      return UserPresences
    })
}

const SendNotification = async (type: number, user: TrackedUser): Promise<void> => {
  if (!user.presence) return

  // if (type === 0) Notify('Status Changes', `${user.name} is offline`) // prettier-ignore
  // if (type === 1) Notify('Status Changes', `${user.name} is online!`) // prettier-ignore // TODO: Don't send notification if user just left the game
  if (type === 2) {
   const notification = await Notify('Status Changes', `${user.name} is now playing ${user.presence.lastLocation}!`) // Send notification
   if (notification) notification.onclick = ():Promise<unknown> => window.electron.ipcRenderer.invoke('joinGame', user.presence?.placeId, user.presence?.gameId) // Open the game page when the notification is clicked
  } // prettier-ignore

  if (type === 3) Notify('Status Changes', `${user.name} is on Studio!`) // prettier-ignore
}

async function MainLoop(friends: Friends, cookie: string): Promise<void> {
  async function GetCurrentUsersData(friends: Friends): Promise<TrackedUsers | undefined> {
    const presence = await GetPresence(
      friends.data.map((friend) => friend.id),
      cookie
    )
    if (!presence) return

    const tracked_users: TrackedUsers = friends.data.reduce((acc: TrackedUsers, friend) => {
      const user = presence.userPresences.find((presence) => presence.userId === friend.id)

      acc[friend.id] = { ...friend, presence: user || null }

      return acc
    }, {})

    return tracked_users
  }

  let last_users_data = {} as TrackedUsers

  async function CheckStatusChanges(): Promise<void> {
    // console.log('Checking for status changes...')
    const current_users_data = await GetCurrentUsersData(friends)
    if (!current_users_data) return

    // Check user status changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(current_users_data).forEach(([id, current_user_data]: [any, TrackedUser]) => {
      const last_user_data = last_users_data[id]
      const last_user_presence_type = last_user_data?.presence?.userPresenceType

      const current_user_presence_type = current_user_data.presence?.userPresenceType

      if (!current_user_presence_type) return

      if (last_user_presence_type !== current_user_presence_type) {
        if (!last_user_presence_type) return // Skip the first iteration
        SendNotification(current_user_presence_type, current_user_data)
      }
    })

    // Update last_user_data
    last_users_data = current_users_data
  }

  const interval = 5 * 1000

  CheckStatusChanges()
  setInterval(async () => {
    await CheckStatusChanges()
  }, interval)
}

export default MainLoop
