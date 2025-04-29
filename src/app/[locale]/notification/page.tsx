'use client';

import { Button } from '@/components/shared/Forms/Buttons/Buttons';
import Notification from '@/components/shared/Notification/Notification';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { AppContext } from '../../../../context/AppContextProvider';
import {
  fetchNotificationApi,
  sendNotification,
  updateNotification,
} from '@/services/notificationApi';
import Skeleton from '@/components/skeleton/skeleton';
import Image from 'next/image';
import { INotification } from '@/constants/types';

const NotificationData = [
  {
    heading: 'You have receive a new order from buyer',
    time: `Febuary 11th, 2025. 15:26pm`,
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
  {
    heading: 'You have receive a new order from buyer',
    time: 'Febuary 11th, 2025. 15:26pm',
  },
];
function page() {
  type NotificationType = {
    _id: string;
    pi_uid: string;
    is_cleared: boolean;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
  };

  const { currentUser } = useContext(AppContext);

  const [notification, setNotification] = useState<NotificationType[]>([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  // const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const container = useRef<HTMLDivElement[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const LoadMoreNotificationObserver = useRef<IntersectionObserver | null>(
    null,
  );

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
      setNotification((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, is_cleared: true } : item
        )
      );
      filterNotification(notification, []);
    } catch (err: any) {
      console.log(err);
    }
  };

  const filterNotification = (currentNotification: INotification[], newNotification: INotification[]) => {
    const mergeNotification = [...currentNotification, ...newNotification];
    const sortNotification :any = []
    const notClearedArray = mergeNotification.filter((notification) => {
      if(notification.is_cleared === false) {
        sortNotification.push(notification)
      }
    });

    const clearedArray = mergeNotification.filter((notification) => {
      if(notification.is_cleared === true) {
        sortNotification.push(notification)
      }
    });
    // sortNotification.push(notClearedArray)
    // sortNotification.push(clearedArray)
    console.log("cleared Array",clearedArray)
    console.log("un-cleared Array",notClearedArray)
    console.log("sort Array",sortNotification)
    
    setNotification(sortNotification);
    // return sortNotification;
  }

  const fetchNotification = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetchNotificationApi({
        pi_uid: currentUser?.pi_uid as string,
        skip: skip,
        limit: limit,
      });
      const newNotifications = response;
      console.log(newNotifications);

      if (newNotifications?.length === 0) {
        // setHasMore(false);
      } else {
        filterNotification(notification, newNotifications);
        setSkip(skip + limit);
        // setNotification((prev) => [...prev, ...newNotifications]);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    if (LoadMoreNotificationObserver.current)
      LoadMoreNotificationObserver.current.disconnect();

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
        fetchNotification();
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

  // useEffect(() => {

  // }, [notification]);

  return (
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <h1 className="mb-5 text-center font-bold text-lg md:text-2xl">
        Notification
      </h1>
      <div className="">
        {!isLoading && notification.length === 0 ? (
          <div className="w-full relative h-[calc(100vh-80px-2rem-32px-20px)] gap-2 text-2xl text-gray-500">
            <div className="absolute m-auto inset-x-0 translate-y-[-50%] top-[50%] mt-[-52px] flex-col h-max w-max flex justify-center items-center">
            <Image
              src="/images/shared/rocket.PNG"
              alt="No notification"
              width={100}
              height={100}
            />
            No notification
            </div>
          </div>
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
              <div className="text-sm text-[#555]">Notification:</div>
              <div className="border border-[#BDBDBD] rounded border-solid px-2 py-1 text-sm mb-1">
                {notify.reason}
              </div>
              <div className="text-sm text-[#555]">Time of notification:</div>
              <div className="flex gap-2">
                <div className="border border-[#BDBDBD] rounded border-solid flex-1 px-2 py-1 text-sm">
                  {formatDate(notify?.createdAt)}
                </div>
                <Button
                  label={notify.is_cleared ? 'Un-clear' : 'Clear'}
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

      {/* <button
        onClick={() => {
          sendNotification({ reason: `You paid for an order to a seller` });
        }}>
        Add Notification
      </button> */}
    </div>
  );
}

export default page;
