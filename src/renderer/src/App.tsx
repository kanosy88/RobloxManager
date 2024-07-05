import { Friends, UserData } from './types/RobloxApi'
import { Notify } from './components/notify'
import { useState } from 'react'
import AppBar from './AppBar'
import MainLoop from './MainLoop'

function App(): JSX.Element {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [friends, setFriends] = useState<Friends | null>(null)
  const [robloxCookie, setrobloxCookie] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setrobloxCookie(e.target.value)
  }

  const handleInit = async (cookie: string): Promise<void> => {
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
          <div className=" flex flex-col justify-center items-center h-full space-y-4">
            {userData && (
              <h1 className="text-3xl font-semibold text-gray-50">
                Connected to{' '}
                <a
                  href={`https://www.roblox.com/users/${userData.id}/profile`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-gray-600"
                >
                  {userData.displayName}
                </a>{' '}
              </h1>
            )}
            {friends && (
              <h1 className="text-3xl font-semibold text-gray-50">
                You have <span className="font-bold text-gray-600">{friends.data.length}</span>{' '}
                friends
              </h1>
            )}
            {!userData && (
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-semibold text-gray-50">Enter your roblox cookie</h2>
                <input type="text" value={robloxCookie} onChange={handleChange} />
              </div>
            )}
            {!userData && (
              <button
                onClick={() => {
                  handleInit(robloxCookie)
                }}
                className="bg-slate-600 hover:bg-slate-950 transition-all p-2 text-white"
              >
                Launch Notifier
              </button>
            )}
          </div>
        </div>
        <div className="p-2">
          <h2 className="text-sm  font-bold text-gray-600 cursor-default">Version 1.0.1</h2>
        </div>
      </div>
    </>
  )
}

export default App
