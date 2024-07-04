import React, { useEffect, useRef, useState } from 'react';
import AppBar from './AppBar';
import Notify from './components/Notify';
import { Friends, UserData } from './types/type';

const cookie = 'YOUR_COOKIE_HERE';

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [friends, setFriends] = useState<Friends | null>(null);
  const listenerAttached = useRef(false);

  function handleNotifer() {
    window.ipcRenderer.send('FetchUserData', cookie);
  }

  useEffect(() => {
    if (!listenerAttached.current) {
      window.Main.on('FetchUserData', (_UserData: UserData) => {
        if (!_UserData) {
          Notify('RobloxManager', 'Failed to fetch user data');
          return;
        }

        setUserData(_UserData);
        Notify('RobloxManager', `Successfully fetched ${_UserData.displayName} data`);
      });
      listenerAttached.current = true;
    }

    window.Main.on('FetchFriends', (_Friends: Friends) => {
      if (!_Friends) {
        Notify('RobloxManager', 'Failed to fetch friends');
        return;
      }
      if (!userData) return;
      setFriends(_Friends);
      Notify('RobloxManager', `Successfully fetched ${userData.displayName} friends`);
    });

    // Cleanup function to remove the listener when the component is unmounted
    return () => {
      window.Main.removeAllListeners('FetchUserData');
      window.Main.removeAllListeners('FetchFriends');
      listenerAttached.current = false;
    };
  }, [userData]);

  return (
    <div className="flex flex-col h-screen">
      {window.Main && (
        <div className="flex-none">
          <AppBar />
        </div>
      )}

      <div className="flex-auto">
        <div className=" flex flex-col justify-center items-center h-full bg-gray-800 space-y-4">
          {userData && (
            <h1 className="text-3xl font-semibold text-gray-50">
              Connected to <span className="font-bold text-violet-300">{userData.displayName}</span>{' '}
            </h1>
          )}
          {friends && (
            <h1 className="text-3xl font-semibold text-gray-50">
              Friends count: <span className="font-bold text-violet-300">{friends.data.length}</span>
            </h1>
          )}
          {!userData && (
            <button onClick={handleNotifer} className="bg-violet-700 hover:bg-violet-400 p-2 rounded text-white">
              Launch Notifier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
