const Notify = (title: string, Body: string) => {
  const NotificationIcon = './assets/icons/Icon-Electron.png';

  const NotificationOption = {
    body: Body,
    icon: NotificationIcon,
    badge: 'https://developer.mozilla.org/en-US/docs/Web/API/Notification/badge',
    tag: 'notification-sample'
  };

  Notification.requestPermission().then((result) => {
    if (result === 'granted') return new Notification(title, NotificationOption);
    return null;
  });
};

export default Notify;
