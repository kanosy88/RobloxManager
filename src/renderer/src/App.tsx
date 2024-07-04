import { Friends, UserData } from './types/RobloxApi'
import { Notify } from './components/notify'
import { useState } from 'react'
import AppBar from './AppBar'
const rbxcookie =
  '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_9669413D8D70909FBC4B28F6D45F129B7170573EC9086971DA113FFB43B594449EBB52EE3464BED4BE205C020A15EA7A9945FEAF7D841622572EC0957821642749A79267B550E9C5D44494A3B91FADE7ADA456C6B4C2ACDCA54857ED47475FE828BDEB2CACCBE3DAE364193673F9489370DC61150464E315E79B36DA66AD62686AF9E9DD463B2E00E417DC4751154F5A83FC6CC7CDEB0A8490D136BE30313ADD88BFEB5A677A3402DF096C5DEF4C22D534F8CCC12925C6328B4FC33F52585F6AE2DD47DFF5E23DE61C95F0A00FB4D861DC8525D0A09B290A0E7D422E3CF8ED29A18BD139E1CF154C1B319BF07034157B7BBD9EE00ABF35557A5B019240B3B65AE4D495A64C9A9172D3FE53A6E9A9EE919C351169F08805EAE317FF8C8AD3272B4890F335A4A47087F0903B4E07D03A4FCDAB288070F63C50A3A725952A314FE179072445BA488230EFBF3E6E353B6A02EBA0E4E102F9FAA3F5914A7AF069DFC351A713C76FE4E784D6ECDE5598727A99BD0EE94540780247DC31B9F983FBD15667E56B5AC7AADC6656654DB2A4C85544B3DD5AA587A108EE57F7941864FFE9403BBD51AAA7256992AB3BB4723E3D76658C03FD03DEA6CFD610320CC5BFC0080EE41ED85E4CA015E3CB06F54AE578B2848211777DFE5BAF5533C394D7B9466B0FE08ADB354499F4EC2397350130B41AA7AB17F0E2D06AE3FA2535F49FC2C8C19496BB100356CA5042BDA4AC524DE5542BE140973776FCA2C1B7B54129DA852CD397FEDF0EED613D8CDF8439A8C9DC602F09B02D774E3E6D105D0475A2E1B6E0061B0D71193EAC61D57AD0AD0752275690D7704F2C5A0A9324C6A9E2B43C03530C95F8013BE563BC91BF5E6E7FB1ACE8040BB60A80CD4111B10FA87282B33C4B66C68C725EF463F1CA1F44CB66F28864A9059FBBD5911159E6091EA94E41255C3E913BB8CF257AC7A60438DD60443F6A425A5592F93B91A5F38A5963758E30F0AF565A56F53D0B24E6C07E19925931F7E2E847402AEC62D8C09CD44BEB38EA03DBA8CA1FCF'

function App(): JSX.Element {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [friends, setFriends] = useState<Friends | null>(null)

  const handleInit = async (cookie: string) => {
    window.electron.ipcRenderer.invoke('fetchUserData', cookie).then((UserData: UserData) => {
      if (!UserData) {
        Notify('Error', 'Failed to fetch user data')
      }
      Notify('Success', `User ID: ${UserData.id}`)
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
              <h1 className="text-3xl font-semibold text-gray-50">
                Friends count:{' '}
                <span className="font-bold text-violet-300">{friends.data.length}</span>
              </h1>
            )}
            {!userData && (
              <button
                onClick={() => {
                  handleInit(rbxcookie)
                }}
                className="bg-violet-700 hover:bg-violet-400 p-2 rounded text-white"
              >
                Launch Notifier
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
