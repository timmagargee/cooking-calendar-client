export class NotifyPropertyChanged<T extends object> {
  public create(data: T, notifyPropertyChanged: (propName: any) => void): T {
    const handler = {
      get(target: T, prop: keyof T, receiver: any): any {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        return undefined;
      },

      set(target: T, prop: keyof T, value: any): boolean {
        target[prop] = value;
        notifyPropertyChanged(prop);
        return true;
      },
    };

    return new Proxy(data, handler as T);
  }
}
