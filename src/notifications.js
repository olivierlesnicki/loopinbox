import React, { useCallback, useContext, useEffect, useState } from "react";
import shortid from "shortid";

import "./notifications.css";

const $noop = () => {};

const notificationsContext = React.createContext({
  add: $noop,
  remove: $noop,
  notifications: {}
});

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({});

  const add = useCallback(notification => {
    const id = shortid.generate();

    setNotifications(notifications => {
      return {
        ...notifications,
        [id]: notification
      };
    });

    return id;
  }, []);

  const remove = useCallback(id => {
    setNotifications(({ ...notifications }) => {
      delete notifications[id];
      return notifications;
    });
  }, []);

  const value = {
    add,
    remove,
    notifications
  };

  return (
    <notificationsContext.Provider value={value}>
      <div className="NotificationsContainer">
        {!!Object.keys(notifications).length && (
          <div className="NotificationsContainer-Notifications">
            {Object.keys(notifications).map(key => (
              <div
                className="NotificationsContainer-Notification"
                key={key}
                {...notifications[key]}
              />
            ))}
          </div>
        )}

        <div className="NotificationsContainer-children">{children}</div>
      </div>
    </notificationsContext.Provider>
  );
};

function useNotifications() {
  return useContext(notificationsContext);
}

export const Notification = props => {
  const { add, remove } = useNotifications();

  useEffect(() => {
    const notificationId = add(props);
    return () => remove(notificationId);
  }, [add, remove, props]);

  return null;
};
