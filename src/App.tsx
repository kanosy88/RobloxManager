import React, { useEffect, useState } from 'react';
import AppBar from './AppBar';

const NotificationIcon = './assets/icons/Icon-Electron.png';

function App() {
  console.log(window.ipcRenderer);

  const [isOpen, setOpen] = useState(false);
  const [isSent, setSent] = useState(false);
  const [fromMain, setFromMain] = useState<string | null>(null);

  const Notify = (title: string, Body: string) => {
    const NotificationOption = {
      body: Body,
      icon: NotificationIcon,
      badge: 'https://developer.mozilla.org/en-US/docs/Web/API/Notification/badge',
      tag: 'notification-sample'
    };

    Notification.requestPermission().then((result) => {
      if (result === 'granted') return new Notification(title, NotificationOption);
    });
  };

  const handleMinimize = () => {
    if (window.Main) {
      window.Main.Minimize();
    } else {
      console.log('You are in a Browser, so no Electron functions are available');
    }
  };

  const handleToggle = () => {
    if (isOpen) {
      setOpen(false);
      setSent(false);
    } else {
      setOpen(true);
      setFromMain(null);
    }
  };
  const sendMessageToElectron = () => {
    if (window.Main) {
      window.Main.sendMessage('Hello from React World');
    } else {
      setFromMain('You are in a Browser, so no Electron functions are available');
    }
    setSent(true);
  };

  useEffect(() => {
    if (isSent && window.Main)
      window.Main.on('message', (message: string) => {
        setFromMain(message);
      });
  }, [fromMain, isSent]);

  return (
    <div className="flex flex-col h-screen">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}

      <div className="flex-auto">
        <div className=" flex flex-col justify-center items-center h-full bg-gray-800 space-y-4">
          <h1 className="text-2xl text-gray-200">Vite + React + Typescript + Electron + Tailwind</h1>
          <div className="flex flex-row gap-5">
            <button
              className="bg-yellow-400 py-2 px-4 rounded focus:outline-none shadow hover:bg-yellow-200"
              onClick={handleToggle}
            >
              Click Me
            </button>
            <button
              className="bg-yellow-400 py-2 px-4 rounded shadow hover:bg-yellow-200"
              onClick={handleMinimize}
              type="button"
            >
              Minimize
            </button>
            <button
              onClick={() => Notify('Hello', 'This is a Notification')}
              className="bg-yellow-400 py-2 px-4 rounded shadow hover:bg-yellow-200"
              type="button"
            >
              Notify
            </button>
          </div>

          {isOpen && (
            <div className="flex flex-col space-y-4 items-center">
              <div className="flex space-x-3">
                <h1 className="text-xl text-gray-50">💝 Welcome 💝, now send a message to the Main 📩📩</h1>
                <button
                  onClick={sendMessageToElectron}
                  className=" bg-green-400 rounded px-4 py-0 focus:outline-none hover:bg-green-300"
                >
                  Send
                </button>
              </div>
              {isSent && (
                <div>
                  <h4 className=" text-green-500">Message sent!!</h4>
                </div>
              )}
              {fromMain && (
                <div>
                  {' '}
                  <h4 className=" text-yellow-200">{fromMain}</h4>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
