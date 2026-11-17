const STORAGE_KEYS = {
  profile: "schemesearch_ai_profile",
  savedSchemes: "schemesearch_ai_saved_schemes",
  applications: "schemesearch_ai_applications",
  schemes: "schemesearch_ai_schemes",
};

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    console.error(`Could not read local storage: ${key}`);
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.error(`Could not save local storage: ${key}`);
    return false;
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    console.error(`Could not remove local storage: ${key}`);
  }
}

export const storage = {
  getProfile: <T>() =>
    readStorage<T | null>(STORAGE_KEYS.profile, null),

  saveProfile: <T>(profile: T) =>
    writeStorage(STORAGE_KEYS.profile, profile),

  getSavedSchemes: () =>
    readStorage<string[]>(STORAGE_KEYS.savedSchemes, []),

  saveSavedSchemes: (ids: string[]) =>
    writeStorage(STORAGE_KEYS.savedSchemes, ids),

  getApplications: <T>() =>
    readStorage<T[]>(STORAGE_KEYS.applications, []),

  saveApplications: <T>(applications: T[]) =>
    writeStorage(STORAGE_KEYS.applications, applications),

  getSchemes: <T>(fallback: T[]) =>
    readStorage<T[]>(STORAGE_KEYS.schemes, fallback),

  saveSchemes: <T>(schemes: T[]) =>
    writeStorage(STORAGE_KEYS.schemes, schemes),

  clearProfile: () =>
    removeStorage(STORAGE_KEYS.profile),
};
