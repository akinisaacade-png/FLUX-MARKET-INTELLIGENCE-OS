/**
 * Storage & Cache Purge Utilities
 * Handles complete client-side and server-side cache, cookies, local storage, and session storage removal.
 */

export interface ClearStorageResult {
  cookiesCleared: number;
  localStorageCleared: boolean;
  sessionStorageCleared: boolean;
  cachesCleared: number;
  indexedDbCleared: boolean;
  serverSignalSent: boolean;
  timestamp: string;
}

export async function clearAllCookiesAndCache(): Promise<ClearStorageResult> {
  let cookiesCount = 0;

  // 1. Clear All Accessible Document Cookies
  try {
    if (document.cookie) {
      const cookies = document.cookie.split(";");
      cookiesCount = cookies.filter((c) => c.trim().length > 0).length;

      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name) {
          // Path /
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
          // Host domain
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`;
          // Port / origin variations
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        }
      }
    }
  } catch (err) {
    console.error("Failed clearing document cookies:", err);
  }

  // 2. Clear LocalStorage
  let localStorageCleared = false;
  try {
    localStorage.clear();
    localStorageCleared = true;
  } catch (err) {
    console.error("Failed clearing localStorage:", err);
  }

  // 3. Clear SessionStorage
  let sessionStorageCleared = false;
  try {
    sessionStorage.clear();
    sessionStorageCleared = true;
  } catch (err) {
    console.error("Failed clearing sessionStorage:", err);
  }

  // 4. Clear CacheStorage (PWA / ServiceWorker caches)
  let cachesCleared = 0;
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      cachesCleared = keys.length;
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch (err) {
    console.error("Failed clearing CacheStorage:", err);
  }

  // 5. Clear IndexedDB
  let indexedDbCleared = false;
  try {
    if ("indexedDB" in window && "databases" in indexedDB) {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      }
      indexedDbCleared = true;
    }
  } catch (err) {
    console.error("Failed clearing IndexedDB:", err);
  }

  // 6. Unregister Service Workers
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }
  } catch (err) {
    console.error("Failed unregistering service workers:", err);
  }

  // 7. Request Server Clear-Site-Data response
  let serverSignalSent = false;
  try {
    const res = await fetch("/api/cache/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      serverSignalSent = true;
    }
  } catch (err) {
    console.error("Failed triggering /api/cache/clear on server:", err);
  }

  return {
    cookiesCleared: cookiesCount,
    localStorageCleared,
    sessionStorageCleared,
    cachesCleared,
    indexedDbCleared,
    serverSignalSent,
    timestamp: new Date().toLocaleTimeString(),
  };
}
