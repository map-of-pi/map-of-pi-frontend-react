'use client';

import { useTranslations } from 'next-intl';
import React, { useContext, useEffect, useRef, useState } from 'react';
import NotificationCard from '@/components/shared/Notification/NotificationCard';
import Skeleton from '@/components/skeleton/skeleton';
import { NotificationType } from '@/constants/types';
import { getNotifications, updateNotification } from '@/services/notificationApi';
import { AppContext } from '../../../../context/AppContextProvider';
import logger from '../../../../logger.config.mjs';

export default function NotificationPage() {
  const t = useTranslations();
  const { currentUser } = useContext(AppContext);

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);
  const [isLoading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const container = useRef<HTMLDivElement[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreObserver = useRef<IntersectionObserver | null>(null);

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
      // Rollback
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
    const notCleared = merged.filter((n) => !n.is_cleared);
    const cleared = merged.filter((n) => n.is_cleared);
    return [...notCleared, ...cleared];
  };

  const fetchNotifications = async () => {
    if (isLoading || !currentUser?.pi_uid) return;
    setLoading(true);

    try {
      const newNotifications = await getNotifications({
        pi_uid: currentUser.pi_uid,
        skip,
        limit
      });

      logger.info('Fetched notifications:', newNotifications);

      if (newNotifications.length > 0) {
        const sorted = sortNotifications(notifications, newNotifications);
        setNotifications(sorted);
        setSkip((prev) => prev + limit);
      }
    } catch (error) {
      logger.error('Error fetching notifications:', error);
    } finally {
      setHasFetched(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser?.pi_uid) return;

    setNotifications([]);
    setSkip(0);
    fetchNotifications();
  }, [currentUser?.pi_uid]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    if (loadMoreObserver.current) loadMoreObserver.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('show', entry.isIntersecting);
          if (entry.isIntersecting) observer.current?.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    container.current.forEach((el) => {
      if (el) observer.current?.observe(el);
    });

    loadMoreObserver.current = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (lastEntry?.isIntersecting) {
          fetchNotifications();
          loadMoreObserver.current?.unobserve(lastEntry.target);
        }
      },
      { threshold: 1 }
    );

    const lastItem = container.current[container.current.length - 1];
    if (lastItem) loadMoreObserver.current.observe(lastItem);

    return () => {
      observer.current?.disconnect();
      loadMoreObserver.current?.disconnect();
    };
  }, [notifications]);

  return (
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <div className="text-center mb-7">
        <h1 className="font-bold text-lg md:text-2xl">
          {t('SCREEN.NOTIFICATIONS.NOTIFICATIONS_HEADER')}
        </h1>
      </div>

      {/* Notifications */}
      <div>
        {!isLoading && hasFetched && notifications.length === 0 ? (
          <h2 className="font-bold mb-2 text-center">
            {t('SCREEN.NOTIFICATIONS.NO_NOTIFICATIONS_SUBHEADER')}
          </h2>
        ) : (
          notifications.map((notify, index) => (
            <NotificationCard
              key={notify._id}
              notification={notify}
              onToggleClear={handleUpdateNotification}
              forwardedRef={(el) => {
                if (el) container.current[index] = el;
              }}
            />
          ))
        )}
      </div>

      {isLoading && <Skeleton type="notification" />}
    </div>
  );
}