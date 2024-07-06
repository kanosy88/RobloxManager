/* eslint-disable prettier/prettier */
import { useState } from 'react'

function AppBar(): JSX.Element {
  const [isMaximize, setMaximize] = useState(false)

  const handleMinimize = (): void => {
    window.electron.ipcRenderer.invoke('minimize')
  }

  const handleMaximize = (): void => {
    window.electron.ipcRenderer.invoke('maximize')
  }

  const handleToggle = (): void => {
    if (isMaximize) {
      setMaximize(false)
    } else {
      setMaximize(true)
    }
    handleMaximize()
  }

  const handleHide = (): void => {
    window.electron.ipcRenderer.invoke('hide')
  }

  return (
    <div className="py-0.5 flex justify-between text-gray-600 draggable bg-[#101010] border-b border-gray-900">
      <div className="ml-2">
        <h1 className="font-semibold flex">Severion</h1>
      </div>
      <div className="inline-flex -mt-1">
        <button
          onClick={handleMinimize}
          className="undraggable md:px-4 lg:px-3 pt-1 px-4 hover:bg-gray-300"
        >
          &#8211;
        </button>
        <button onClick={handleToggle} className="undraggable px-6 lg:px-5 pt-1 hover:bg-gray-300">
          {isMaximize ? '\u2752' : '⃞'}
        </button>
        <button
          onClick={handleHide}
          className="undraggable px-4 pt-1 hover:bg-red-500 hover:text-white"
        >
          &#10005;
        </button>
      </div>
    </div>
  )
}

export default AppBar
