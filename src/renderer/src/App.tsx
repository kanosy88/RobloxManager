import { Friends, UserData } from './types/RobloxApi'
import { Notify } from './components/notify'
import { useState } from 'react'
import AppBar from './AppBar'
import MainLoop from './MainLoop'

function App(): JSX.Element {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [friends, setFriends] = useState<Friends | null>(null)
  const [robloxCookie, setrobloxCookie] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setrobloxCookie(e.target.value)
  }

  const handleHide = async () => {
    window.electron.ipcRenderer.invoke('hide')
  }

  const handleInit = async (cookie: string) => {
    window.electron.ipcRenderer.invoke('fetchUserData', cookie).then((UserData: UserData) => {
      if (!UserData) {
        Notify('Error', 'Failed to fetch user data')
        return
      }
      setUserData(UserData)

      window.electron.ipcRenderer.invoke('fetchFriends', UserData.id).then((Friends: Friends) => {
        if (!Friends) {
          Notify('Error', 'Failed to fetch friends')
          return
        }
        setFriends(Friends)

        MainLoop(Friends, cookie)
      })

      Notify('Success', `Connected to ${UserData.displayName}`)
    })
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        <AppBar />

        <div className="flex-auto">
          <div className=" flex flex-col justify-center items-center h-full bg-gray-800 space-y-4">
            {userData && (
              <h1 className="text-3xl font-semibold text-gray-50">
                Connected to{' '}
                <span className="font-bold text-violet-300">{userData.displayName}</span>{' '}
              </h1>
            )}
            {friends && (
              <>
                <h1 className="text-3xl font-semibold text-gray-50">
                  Friends count:{' '}
                  <span className="font-bold text-violet-300">{friends.data.length}</span>
                </h1>
                <button
                  onClick={handleHide}
                  className="bg-violet-700 hover:bg-violet-400 p-2 rounded text-white"
                >
                  Hide the app
                </button>
              </>
            )}
            {!userData && (
              <button
                onClick={() => {
                  handleInit(robloxCookie)
                }}
                className="bg-violet-700 hover:bg-violet-400 p-2 rounded text-white"
              >
                Launch Notifier
              </button>
            )}
            {!userData && (
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-semibold text-gray-50">Enter your roblox cookie</h2>
                <input type="text" value={robloxCookie} onChange={handleChange} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
