/* eslint-disable prettier/prettier */

const Icon = '../../../resources/icon.png'

const Notify = async (title: string, Body: string): Promise<Notification | null> => {
  const NotificationOption = {
    body: Body,
    icon: Icon
  }

  const result = await Notification.requestPermission()
  if (result === 'granted') {
    return new Notification(title, NotificationOption)
  } else {
    return null
  }
}

export { Notify }
