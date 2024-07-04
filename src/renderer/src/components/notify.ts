/* eslint-disable prettier/prettier */

const Icon = '../../../resources/icon.png'

const Notify = (title: string, Body: string): void => {
  const NotificationOption = {
    body: Body,
    icon: Icon
  }

  Notification.requestPermission().then((result) => {
    if (result === 'granted') return new Notification(title, NotificationOption)
    return null
  })
}

export { Notify }
