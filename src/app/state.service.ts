import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface State {
  startRecipeInEdit: boolean;
  dateToAssign?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public state: Observable<State>;

  private internalState: State = {
    startRecipeInEdit: false,
  };

  public constructor() {
    this.state = new BehaviorSubject(this.internalState);
  }

  public get staticState(): State {
    return { ...(this.state as BehaviorSubject<State>).value };
  }

  public setStartRecipeInEdit(val: boolean): void {
    this.internalState = {
      ...this.internalState,
      startRecipeInEdit: val,
    };

    this.updateState();
  }

  public setDateToAssign(date?: Date): void {
    this.internalState = {
      ...this.internalState,
      dateToAssign: date,
    };

    this.updateState();
  }

  private updateState(): void {
    (this.state as BehaviorSubject<State>).next(this.internalState);
  }
}
