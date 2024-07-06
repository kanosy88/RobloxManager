/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch, { Headers } from 'node-fetch'
import { Friends, UserPresences, type UserData } from './types/RobloxApi'

// TODO: Fix the first iteration bug in the main loop (the first iteration is always skipped)

const fetchUserData = async (cookie: string): Promise<false | UserData> => {
  const myHeaders = new Headers()
  myHeaders.append('cookie', `.ROBLOSECURITY=${cookie};`)

  const requestOptions = {
    method: 'GET',
    headers: myHeaders
  }

  try {
    const response = await fetch('https://users.roblox.com/v1/users/authenticated', requestOptions)
    const result: unknown | any = await response.json()
    if (result.errors) {
      if (result.errors.response && result.errors.response.data.errors[0].code === 0) {
        // If the error code is 0, it means the cookie is invalid.µ
        console.warn(
          'Error while fetching user data:',
          result.errors.response.data.errors[0].message
        )
        console.warn('Invalid cookie provided in config.json. Please provide a valid cookie.')
        return false
      }
      console.error('An error occurred while fetching user data:', result.errors)
      return false
    }
    return result as UserData
  } catch (error) {
    console.error('An error occurred while fetching user data:', error)
    return false
  }
}

const fetchFriends = async (userId: number): Promise<false | Friends> => {
  const response = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends`, {
    method: 'GET'
  })

  try {
    const data = await response.json()
    return data as Friends
  } catch (error) {
    console.error('An error occurred while fetching friends:', error)
    return false
  }
}

const fetchPresences = async (
  userIds: number[],
  cookie: string
): Promise<false | UserPresences> => {
  const myHeaders = new Headers()
  myHeaders.append('cookie', `.ROBLOSECURITY=${cookie};`)
  myHeaders.append('Content-Type', 'application/json')

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({ userIds })
  }

  const response = await fetch('https://presence.roblox.com/v1/presence/users', requestOptions)

  try {
    const data = await response.json()
    return data as UserPresences
  } catch (error) {
    console.error('An error occurred while fetching presence:', error)
    return false
  }
}

export { fetchUserData, fetchFriends, fetchPresences }
