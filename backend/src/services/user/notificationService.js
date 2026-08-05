import prisma from "../../database/prismaClient.js";

export const listNotifications = async (customerId, query = {}) => {
  const normalizedCustomerId = Number(customerId);
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
  const skip = (safePage - 1) * safeLimit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { customerId: normalizedCustomerId },
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
    }),
    prisma.notification.count({ where: { customerId: normalizedCustomerId } }),
  ]);

  return {
    items: notifications,
    total,
    page: safePage,
    pageSize: safeLimit,
  };
};

export const markNotificationAsRead = async (customerId, notificationId) => {
  const normalizedCustomerId = Number(customerId);
  const normalizedNotificationId = Number(notificationId);

  const notification = await prisma.notification.findFirst({
    where: { id: normalizedNotificationId, customerId: normalizedCustomerId },
  });

  if (!notification) return null;

  return prisma.notification.update({
    where: { id: normalizedNotificationId },
    data: { isRead: true },
  });
};

export const markAllNotificationsAsRead = async (customerId) => {
  const normalizedCustomerId = Number(customerId);
  const result = await prisma.notification.updateMany({
    where: { customerId: normalizedCustomerId, isRead: false },
    data: { isRead: true },
  });

  return result;
};
