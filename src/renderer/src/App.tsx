import { Friends, UserData } from './types/RobloxApi'
import { Notify } from './components/notify'
import { useState, useEffect, useRef } from 'react'
import AppBar from './AppBar'
import MainLoop from './MainLoop'

function App(): JSX.Element {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [friends, setFriends] = useState<Friends | null>(null)
  const [robloxCookie, setrobloxCookie] = useState<string>('')
  const initCalled = useRef(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => setrobloxCookie(e.target.value) // prettier-ignore

  const handleInit = async (cookie: string): Promise<void> => {
    try {
      const savedData: { [key: string]: string } =
        await window.electron.ipcRenderer.invoke('readData')
      if (savedData && savedData['cookie']) {
        setrobloxCookie(savedData['cookie'])
        cookie = savedData['cookie']
      }

      const userData: UserData = await window.electron.ipcRenderer.invoke('fetchUserData', cookie)
      if (!userData) {
        Notify('Error', 'Failed to fetch user data')
        return
      }
      setUserData(userData)

      const friendsData: Friends = await window.electron.ipcRenderer.invoke(
        'fetchFriends',
        userData.id
      )
      if (!friendsData) {
        Notify('Error', 'Failed to fetch friends')
        return
      }
      setFriends(friendsData)
      MainLoop(friendsData, cookie)

      Notify('Success', `Connected to ${userData.displayName}`)
      window.electron.ipcRenderer.invoke('saveData', 'cookie', cookie)
    } catch (error) {
      console.error('Initialization failed:', error)
      Notify('Error', 'Initialization failed')
    }
  }

  const HandleReset = (): void => {
    setrobloxCookie('')
    setUserData(null)
    setFriends(null)
    window.electron.ipcRenderer.invoke('saveData', 'cookie', '')
  }

  useEffect(() => {
    const initializeApp = async (): Promise<void> => {
      if (initCalled.current) return // Prevent multiple calls
      initCalled.current = true // Mark as called
      const savedData: { [key: string]: string } =
        await window.electron.ipcRenderer.invoke('readData')
      if (savedData && savedData['cookie']) {
        await handleInit(savedData['cookie'])
      }
    }
    initializeApp()
  }, [])

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
                <input type="text" onChange={handleChange} />
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
            {userData && (
              <button
                onClick={HandleReset}
                className="bg-slate-600 hover:bg-slate-950 transition-all p-2 text-white"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="p-2">
          <h2 className="text-sm  font-bold text-gray-600 cursor-default">Version 1.1</h2>
        </div>
      </div>
    </>
  )
}

export default App
