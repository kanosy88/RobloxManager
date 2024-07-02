const Icon = './assets/icons/AppIcon.png';

const Notify = (title: string, Body: string) => {
  const NotificationOption = {
    body: Body,
    icon: Icon
  };

  Notification.requestPermission().then((result) => {
    if (result === 'granted') return new Notification(title, NotificationOption);
    return null;
  });
};

export default Notify;
