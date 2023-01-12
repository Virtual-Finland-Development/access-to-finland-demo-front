class JSONStorage {
  driver: Storage;

  constructor(driver: Storage) {
    this.driver = driver;
  }

  get(key: string) {
    const value = this.driver.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  set(key: string, value: any) {
    this.driver.setItem(key, JSON.stringify(value));
  }
  clear() {
    this.driver.clear();
  }
  has(key: string): boolean {
    return !!this.driver.getItem(key);
  }
}

export const JSONLocalStorage = new JSONStorage(localStorage);
export const JSONSessionStorage = new JSONStorage(sessionStorage);
