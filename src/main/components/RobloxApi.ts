import axios, { type AxiosRequestConfig } from 'axios';
import type { Friends, UserData, UserPresences } from '../../types/type';

async function fetchUserData(roblox_cookie: string) {
  document.cookie = `.ROBLOSECURITY=${roblox_cookie}`;
  const RequestConfig: AxiosRequestConfig = {
    url: 'https://users.roblox.com/v1/users/authenticated',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `.ROBLOSECURITY=${roblox_cookie}`,
      Accept: '/'
    },
    withCredentials: true
  };

  try {
    const res = await axios(RequestConfig);
    return res.data as UserData;
  } catch (err: any) {
    if (err.response && err.response.data.errors[0].code === 0) {
      // If the error code is 0, it means the cookie is invalid.µ
      console.warn('Error while fetching user data:', err.response.data.errors[0].message);
      console.warn('Invalid cookie provided in config.json. Please provide a valid cookie.');
      return false;
    }
    console.error('An error occurred while fetching user data:', err);
    return false;
  }
}

async function get_friends(user_id: number, roblox_cookie: string) {
  const RequestConfig: AxiosRequestConfig = {
    url: `https://friends.roblox.com/v1/users/${user_id}/friends`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `.ROBLOSECURITY=${roblox_cookie}`
    }
  };

  console.log('getting friends');

  try {
    const res = await axios(RequestConfig);
    console.log('Get Friend Success');
    return res.data as Friends;
  } catch (err) {
    console.error('An error occurred while fetching friends list:', err);
    return false;
  }
}

async function get_presence(user_ids: number[], roblox_cookie: string) {
  const RequestConfig: AxiosRequestConfig = {
    url: `https://presence.roblox.com/v1/presence/users`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `.ROBLOSECURITY=${roblox_cookie}`
    },
    data: {
      userIds: user_ids
    }
  };

  try {
    const res = await axios(RequestConfig);
    return res.data as UserPresences;
  } catch (err) {
    console.error('An error occurred while fetching presence data:', err);
    return false;
  }
}

export { fetchUserData, get_friends, get_presence };
