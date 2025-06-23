'use client';

import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/shared/Forms/Buttons/Buttons';
import Skeleton from '@/components/skeleton/skeleton';
import { INotification, NotificationType } from '@/constants/types';
import {
  getNotifications as fetchNotificationsApi,
  updateNotification,
} from '@/services/notificationApi';
import { AppContext } from '../../../../context/AppContextProvider';
import logger from '../../../../logger.config.mjs';

export default function NotificationPage() {
  const HEADER = 'font-bold text-lg md:text-2xl';
  const SUBHEADER = 'font-bold mb-2';
  const t = useTranslations();

  const { currentUser } = useContext(AppContext);
  const [notification, setNotification] = useState<NotificationType[]>([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const container = useRef<HTMLDivElement[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const LoadMoreNotificationObserver = useRef<IntersectionObserver | null>(null);

  function formatDate(dateString: string | Date) {
    const date = new Date(dateString);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const day = date.getDate();
    const daySuffix = getDaySuffix(day);

    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${month} ${day}${daySuffix}, ${year}. ${hours}:${formattedMinutes}${ampm}`;
  }

  function getDaySuffix(day: number) {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  const handleUpdateNotification = async (id: string, is_cleared: boolean) => {
    if (is_cleared) return;
    try {
      await updateNotification(id);
      const notificationId = notification.findIndex((notify) => notify._id === id);
      notification[notificationId].is_cleared = true;
      setNotification(notification);
      filterNotification(notification, []);
    } catch (error) {
      logger.error('Error updating notification:', error);
    }
  };

  const filterNotification = (currentNotification: INotification[], newNotification: INotification[]) => {
    const mergeNotification = [...currentNotification, ...newNotification];
    const sortNotification : any = [];
    const notClearedArray = mergeNotification.filter((notification) => {
      if (notification.is_cleared === false) {
        sortNotification.push(notification);
      }
    });
    logger.info('Not Cleared array', notClearedArray);
    
    const clearedArray = mergeNotification.filter((notification) => {
      if (notification.is_cleared === true) {
        sortNotification.push(notification);
      }
    });
    logger.info('Cleared array', clearedArray);

    logger.info('Sorted notification array', sortNotification);
    
    setNotification(sortNotification);
  }

  const fetchNotifications = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetchNotificationsApi({
        pi_uid: currentUser?.pi_uid as string,
        skip: skip,
        limit: limit,
      });
      const newNotifications = response;
      logger.info('New notifications', newNotifications);

      if (newNotifications?.length === 0) {
      } else {
        filterNotification(notification, newNotifications);
        setSkip(skip + limit);
      }
    } catch (error) {
      logger.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    if (LoadMoreNotificationObserver.current) LoadMoreNotificationObserver.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('show', entry.isIntersecting);
          if (entry.isIntersecting) observer.current?.unobserve(entry.target);
        });
      },
      {
        threshold: 0.5,
      },
    );

    container.current.forEach((cont: any) => {
      if (cont) observer.current?.observe(cont);
    });

    LoadMoreNotificationObserver.current = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (!lastEntry.isIntersecting) return;
        fetchNotifications();
        LoadMoreNotificationObserver.current?.unobserve(lastEntry.target); // Stop observing old last item
      },
      {
        threshold: 1,
      },
    );

    // Attach observer to the last item when notification changes
    const lastChild = container.current[container.current.length - 1];
    if (lastChild) {
      LoadMoreNotificationObserver.current.observe(lastChild);
    }

    return () => {
      observer.current?.disconnect();
      LoadMoreNotificationObserver.current?.disconnect();
    };
  }, [notification]);

  return (
    <>
      <div className="w-full md:w-[500px] md:mx-auto p-4">
        <div className="text-center mb-5">
          <h1 className={HEADER}>
            {t('SCREEN.NOTIFICATIONS.NOTIFICATIONS_HEADER')}
          </h1>
        </div>

        <div className="mb-4">
          {!isLoading && notification.length === 0 ? (
            <h2 className={SUBHEADER}>
              {t('SCREEN.NOTIFICATIONS.NO_NOTIFICATIONS_SUBHEADER')}
            </h2>
          ) : (
            notification.map((notify, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) container.current[index] = el;
                }}
                className={`notiCard`}
                style={{
                  backgroundColor: notify.is_cleared ? '#eedfb6' : 'transparent',
                }}>
                <div className="text-sm text-[#555]">
                  {t('SCREEN.NOTIFICATIONS.NOTIFICATION_SECTION.NOTIFICATION_LABEL') + ': '}
                </div>
                <div className="border border-[#BDBDBD] rounded border-solid px-2 py-1 text-sm mb-1">
                  {notify.reason}
                </div>
                <div className="text-sm text-[#555]">
                {t('SCREEN.NOTIFICATIONS.NOTIFICATION_SECTION.NOTIFICATION_TIME_LABEL') + ': '}
                </div>
                <div className="flex gap-2">
                  <div className="border border-[#BDBDBD] rounded border-solid flex-1 px-2 py-1 text-sm">
                    {formatDate(notify?.createdAt)}
                  </div>
                  <Button
                    label={notify.is_cleared ? 
                      t('SCREEN.NOTIFICATIONS.NOTIFICATION_SECTION.NOTIFICATION_STATUS.UNREAD') 
                      : t('SCREEN.NOTIFICATIONS.NOTIFICATION_SECTION.NOTIFICATION_STATUS.READ')
                    }
                    styles={{ color: '#ffc153' }}
                    onClick={() =>
                      handleUpdateNotification(notify._id, notify.is_cleared)
                    }
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* USED FOR OBSERVER TO LOAD MORE NOTIFICATION DATA */}
        {isLoading && (
          <Skeleton type="notification" />
        )}
      </div>
    </>
  );
}