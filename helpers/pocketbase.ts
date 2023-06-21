import PocketBase from "pocketbase";

const isProd = process.env.NODE_ENV === "production";

export const pb = new PocketBase(
  isProd ? "https://pb.cloud.xi72yow.de" : "http://127.0.0.1:8090"
);

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
    }

    resolve(authData);
  });
}
