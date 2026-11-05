import { messaging, getToken, onMessage } from "../firebase";
import getMessagingRegistration from "./getMessagingRegistration";
import useAxios from "./useAxios";
import { isAdmin, isLocationMasterReadOnly } from "./util";

const VAPID_KEY =
  "BJL8nmbe31A9I8MuiulNUL8Ip-6ZL3rYihhIG7oA_4Q-WBZAU53BENLfw6y94Zz6m9YQQZgrXpeZ-BtXNy_R3i8";
const FCM_WAIT_MS = 8000;

let foregroundBound = false;

export const isStaffRole = (role) =>
  isAdmin(role) || isLocationMasterReadOnly(role);

export async function getFcmToken() {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return null;
    }
    if (Notification.permission === "denied") {
      return null;
    }
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return null;
      }
    }
    const tokenPromise = (async () =>
      getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: await getMessagingRegistration(),
      }))();
    return await Promise.race([
      tokenPromise,
      new Promise((resolve) => setTimeout(() => resolve(null), FCM_WAIT_MS)),
    ]);
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
}

export async function saveFcmToken(userId, fcmToken) {
  if (!userId || !fcmToken) return;
  await useAxios.patch(`/user/fcmTokenUpdate/${userId}`, { fcmToken });
}

/** Register push for admins/managers after login so they receive staff alerts. */
export async function registerStaffPush(user) {
  if (!user || !isStaffRole(user.role)) {
    return null;
  }
  const userId = user.id || user._id;
  if (!userId) return null;

  const fcmToken = await getFcmToken();
  if (!fcmToken) return null;

  try {
    await saveFcmToken(userId, fcmToken);
  } catch (error) {
    console.error("FCM token save failed:", error);
  }

  if (!foregroundBound) {
    foregroundBound = true;
    try {
      onMessage(messaging, (payload) => {
        const title = payload?.notification?.title || "Yuvadarpan";
        const body = payload?.notification?.body || "";
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(title, {
            body,
            icon: "/apple-touch-icon.png",
          });
        }
      });
    } catch (error) {
      console.error("FCM foreground listener failed:", error);
    }
  }

  return fcmToken;
}
