import PocketBase from "pocketbase";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

const isProd = process.env.NODE_ENV === "production";

export const pocketbaseURL = "https://pb.cloud.xi72yow.de";

export const pb = new PocketBase(pocketbaseURL);

function saveCookie() {
  setCookie("pb_auth", pb.authStore.exportToCookie(), {
    maxAge: 60 * 60 * 24 * 14,
    path: "/",
    secure: isProd,
    sameSite: "lax",
  });
}

export function logout() {
  pb.authStore.clear();
  deleteCookie("pb_auth");
}

export default function loginPocketBase({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return new Promise(async (resolve, reject) => {
    const authData = await pb
      .collection("users")
      .authWithPassword(username, password)
      .catch((err) => {
        reject("Anmeldung fehlgeschlagen.");
      });

    try {
      pb.authStore.isValid && (await pb.collection("users").authRefresh());
    } catch (_) {
      pb.authStore.clear();
      reject("Anmeldung fehlgeschlagen.");
    }

    if (pb.authStore.isValid && pb.authStore.model) {
      await pb.collection("users").update(pb.authStore.model.id, {
        lastActive: new Date(),
      });

      saveCookie();
      resolve(authData);
    }
  });
}

export function loginViaCookie() {
  return new Promise(async (resolve, reject) => {
    const pb_auth = getCookie("pb_auth");
    let authData = null;

    await pb.authStore.loadFromCookie(pb_auth?.toString() || "");

    try {
      if (pb.authStore.isValid) {
        authData = await pb.collection("users").authRefresh();
      }
    } catch (_) {
      pb.authStore.clear();
      reject("Anmeldung fehlgeschlagen.");
    }

    if (pb.authStore.isValid && pb.authStore.model) {
      await pb.collection("users").update(pb.authStore.model.id, {
        lastActive: new Date(),
      });
      saveCookie();
      resolve(authData);
    }
  });
}
