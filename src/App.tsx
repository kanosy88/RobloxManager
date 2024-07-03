import React, { useEffect, useRef, useState } from 'react';
import AppBar from './AppBar';
import Notify from './components/Notify';
import { Friends, UserData } from './types/type';

const cookie =
  '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_7B5AC8FA5677DC7129A18D7B13A2A9433D1598F41888FE23927B581AB470DA65B005EA2280C5ED7B84D1DA6AE0F05CB67230F1AA349DCCE16131DB897355B5A634F42AA9D666D448551E878A58F57DB3519E4FF4348F3AD61AE61CECADB61DDEA37FB4796993F80056C749A3B9FA2ADD24DD736DE472EE8A84E22E5D0CCDC005308F92492309445D774B28BC27ADC676F8B5ED9E5707B57DE7CF02B18EB1EE53359BD45A577CA3EF3EE888DBE11C46918577E0DB7AE4040BA4B48DDC766CFB832F5D6307D86BA3C6CF0ADA85CE4DEB85C6ECADA9B1646F5D145FE74193894E0BE4625BBB9622E6A27A61BA807B1C666F9658DF4D32A03A144E1AB617372A18EAA8A6D0B8F4F11A3B907EB0DAB41459EAA1E96FC3FCC94D747BC6CFA267D550CA642D0EF541E3429381059D4B85C577E81DDA65438092BE03E40EBE11F69E059447811D40BF4EF84F70122A269BD90ED5552826D9889953E74543737C9DDE6C6C215D59F3C31339980E1466C1803D3FFE4CFE3634133109A24FBB3196622EF1ABA075FE0C2340FA64045C2B3F6E467EDDB8525356F6FFD3B8D709646B425E4B75937CD2D9F772F3F48764AD32E91CCDE3783950AC765A189800D57F88C8FD3A41B0DEF9307BDF664A356599F0E0C039E8A5F3C77F982C3EBB5C812642266839F55C9FA5E5B4AE474A33A9939CB3710A604DB7880C5EDB4CA5AA2AD3447B4333817CDEA845E386BFFFA4BCEFC0DB1F729854775B0BAD859846805EE3264F0C8E7FC0CE021BF9FEAF455514299317D45F2F89004FBE4A63E27025A7C64EA479FEEB6C064744F12336C387BA3BAF093A35F21F0AF59EAB606398A4548368C8F3C67F67DB2F82EE6466042A9B2F601F985340082BA5E942D6E75745FDE38C2A6A8988D2A0E8A88E5EAEA04F7F27553E5A78DAEFB29320E48F02208A5B0E5ABB620948D4C0AEFB02C991F2714B66392499F0AF1066C28FDB24DAC588C86AAB68AD2909AA5A87323E41ECD97B4029CD57DF60131A44F6ABE16DD85D2799555F828E10A6C9718E8F';

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
