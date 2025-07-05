'use client';

import { useTranslations, useLocale } from 'next-intl';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/shared/Forms/Buttons/Buttons';
import { Input } from '@/components/shared/Forms/Inputs/Inputs';
import Skeleton from '@/components/skeleton/skeleton';
import { INotification, NotificationType } from '@/constants/types';
import {
  getNotifications,
  updateNotification,
} from '@/services/notificationApi';

import { AppContext } from '../../../../context/AppContextProvider';
import logger from '../../../../logger.config.mjs';

export default function NotificationPage() {
  const locale = useLocale();
  const t = useTranslations();

  const HEADER = 'font-bold text-lg md:text-2xl';
  const SUBHEADER = 'font-bold mb-2';

  const { currentUser } = useContext(AppContext);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setLoading] = useState(false);
  
  const container = useRef<HTMLDivElement[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const LoadMoreNotificationObserver = useRef<IntersectionObserver | null>(null);

  const handleUpdateNotification = async (id: string) => {
    const prev = notifications.find((n) => n._id === id);
    if (!prev) return;

    setNotifications((prevList) =>
      prevList.map((n) =>
        n._id === id ? { ...n, is_cleared: !n.is_cleared } : n
      )
    );

    try {
      await updateNotification(id);
    } catch (error) {
      logger.error('Error updating notification:', error);
      // Rollback on failure
      setNotifications((prevList) =>
        prevList.map((n) =>
          n._id === id ? { ...n, is_cleared: prev.is_cleared } : n
        )
      );
    }
  };

  const sortNotifications = (
    current: NotificationType[],
    incoming: NotificationType[]
  ): NotificationType[] => {
    const merged = [...current, ...incoming];
    const notCleared = merged.filter(n => !n.is_cleared);
    const cleared = merged.filter(n => n.is_cleared);
    return [...notCleared, ...cleared];
  };

  const fetchNotifications = async () => {
    if (isLoading || !currentUser?.pi_uid) return;
    setLoading(true);

    try {
      const existingNotifications = await getNotifications({
        pi_uid: currentUser?.pi_uid,
        skip,
        limit
      });
      logger.info('Fetched notifications:', existingNotifications);

      if (existingNotifications.length) {
        const sorted = sortNotifications(notifications, existingNotifications);
        setNotifications(sorted);
        setSkip(prev => prev + limit);
      }
    } catch (error) {
      logger.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser?.pi_uid) return;
    
    // Reset notifications and pagination on user change
    setNotifications([]);
    setSkip(0);
    fetchNotifications();
  }, [currentUser?.pi_uid]);

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
      { threshold: 0.5 },
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
      { threshold: 1 },
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
  }, [notifications]);

  return (
    <>
      <div className="w-full md:w-[500px] md:mx-auto p-4">
        <div className="text-center mb-7">
          <h1 className={HEADER}>
            {t('SCREEN.NOTIFICATIONS.NOTIFICATIONS_HEADER')}
          </h1>
        </div>

        {/* Notifications */}
        <div>
          {!isLoading && notifications.length === 0 ? (
            <h2 className={SUBHEADER}>
              {t('SCREEN.NOTIFICATIONS.NO_NOTIFICATIONS_SUBHEADER')}
            </h2>
          ) : (
            notifications.map((notify, index) => {
              const formattedDate = new Intl.DateTimeFormat(locale || 'en-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }).format(new Date(notify.createdAt));

              return (
                <div
                  key={notify._id}
                  ref={(el) => {
                    if (el) container.current[index] = el;
                  }}
                  className={`relative outline outline-50 outline-gray-600 rounded-lg mb-7
                    transition-all duration-150 ease-in-out transform
                    ${notify.is_cleared ? 'bg-yellow-100' : ''}
                    ${true ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'}`}
                >
                  <div className="p-3">
                    <div className="mb-3">
                      <Input
                        label={t('SCREEN.NOTIFICATIONS.NOTIFICATION_SECTION.NOTIFICATION_LABEL') + ':'}
                        name="reason"
                        type="text"
                        value={notify.reason}
                        disabled={true}
                      />
                    </div>

                    <div className="flex gap-x-4">
                      <div className="flex-auto w-64">
                        <Input
                          label={t('SCREEN.NOTIFICATIONS.NOTIFICATION_SECTION.NOTIFICATION_TIME_LABEL') + ':'}
                          name="createdAt"
                          type="text"
                          value={formattedDate}
                          disabled={true}
                        />
                      </div>

                      <div className="flex-auto w-32">
                        <div className="flex-auto w-full flex items-end pt-[30px]">
                          <Button
                            label={notify.is_cleared ? 
                              t('SCREEN.NOTIFICATIONS.NOTIFICATION_SECTION.NOTIFICATION_STATUS.UNREAD') 
                              : t('SCREEN.NOTIFICATIONS.NOTIFICATION_SECTION.NOTIFICATION_STATUS.READ')
                            }
                            styles={{ color: '#ffc153', width: '100%', height: '47px' }}
                            onClick={() => handleUpdateNotification(notify._id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* USED FOR OBSERVER TO LOAD MORE NOTIFICATION DATA */}
        {isLoading && <Skeleton type="notification" />}
      </div>
    </>
  );
}