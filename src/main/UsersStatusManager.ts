import Notify from '../components/Notify';
import type { TrackedUser, TrackedUsers, UserData, UserPresences } from '../types/type';
import { fetchUserData, get_friends, get_presence } from './components/RobloxApi';

async function RobloxStatusManager(cookie: string) {
  const user_data = await fetchUserData(cookie);
  if (!user_data) return;

  console.log(`Suffessfully logged in as ${user_data?.displayName}!`);

  const friends = await get_friends(user_data.id, cookie);

  async function get_tracked_user() {
    if (!friends) return;

    const presence = await get_presence(
      friends.data.map((friend) => friend.id),
      cookie
    );
    if (!presence) return;

    const tracked_users: TrackedUsers = friends.data.reduce((acc: TrackedUsers, friend) => {
      const user = presence.userPresences.find((presence) => presence.userId === friend.id);

      acc[friend.id] = { ...friend, presence: user || null };

      return acc;
    }, {});

    return tracked_users;
  }

  let last_users_data = {} as TrackedUsers;

  async function check_status_changes() {
    console.log('Checking for status changes...');
    const current_users_data = await get_tracked_user();
    if (!current_users_data) return;

    // Check user status changes
    Object.entries(current_users_data).forEach(([id, current_user_data]: [any, TrackedUser]) => {
      const last_user_data = last_users_data[id];
      const last_user_presence_type = last_user_data?.presence?.userPresenceType;

      if (last_user_presence_type !== current_user_data.presence?.userPresenceType) {
        if (current_user_data.presence?.userPresenceType === 2) {
          console.log(`${current_user_data.name} is now playing ${current_user_data.presence.lastLocation}!`);
          Notify('User Status', `${current_user_data.name} is now playing ${current_user_data.presence.lastLocation}!`);
        }
      }
    });

    // Update last_user_data
    last_users_data = current_users_data;
  }

  const interval = 30 * 1000; // Get the interval from the user input

  check_status_changes();
  setInterval(async () => {
    await check_status_changes();
  }, interval);
}

export default RobloxStatusManager;
