import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { NotifyPropertyChanged } from './notify-property-changed';

export interface DataHandlerValidation {
  [key: string]: (value: any) => Observable<string | undefined>;
}

interface DataHandlerValidationSub {
  [key: string]: Subscription;
}

interface DataHandlerValidationErrors {
  [key: string]: string;
}

export class SingleDataHandler<T extends object> {
  public data: T = {} as T;
  public valid: boolean = true;
  public initialized: boolean = false;

  public dirty: boolean = false;
  private dirty$: Observable<boolean> = new BehaviorSubject<boolean>(
    false
  ).pipe(distinctUntilChanged());

  protected initData: T | undefined;
  private dataChange = new Subject<void>();

  private validation?: DataHandlerValidation;
  private validationSubs: DataHandlerValidationSub = {};
  public validationErrors: DataHandlerValidationErrors = {};

  protected propChangedCallback?: (prop: string) => void;

  public constructor(private destroy: Observable<any>) {
    this.dataChange.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.triggerDirty(this.isDirty());
    });
  }

  private dataChangedWithProp(prop: any, notify: boolean = true): void {
    this.dataChanged();
    if (this.propChangedCallback && notify) {
      this.propChangedCallback(prop);
    }
  }

  public setInitialData(data: T): void {
    this.setupInitialData(data);
    this.triggerDirty(false);
    this.initialized = true;
  }

  public clear(): void {
    this.data = {} as T;
    this.valid = true;
    this.initialized = false;
    this.triggerDirty(false);
  }

  public setValidation(validation: DataHandlerValidation): void {
    this.validation = validation;
  }

  public promoteChanges(): void {
    if (this.data) {
      this.setupInitialData(this.getRawData());
      this.dataChanged();
    }
  }

  public revertChanges(): void {
    if (this.initData) {
      this.setInitialData(this.initData);
    }
  }

  public getRawData(): T {
    return this.data as T;
  }

  protected dataChanged(): void {
    this.dataChange.next();
  }

  private initWrappedData(data: any): T {
    return new NotifyPropertyChanged<typeof data>().create(
      data,
      this.dataChangedWithProp.bind(this)
    );
  }

  private triggerDirty(dirty: boolean): void {
    this.dirty = dirty;
    (this.dirty$ as BehaviorSubject<boolean>).next(dirty);
  }

  private isDirty(): boolean {
    return JSON.stringify(this.data) !== JSON.stringify(this.initData);
  }

  protected setupInitialData(data: T): void {
    this.initData = { ...data };
    this.data = this.initWrappedData(data);
  }
}
