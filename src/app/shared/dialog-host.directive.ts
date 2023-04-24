import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dlgHost]'
})
export class DialogHostDirective {
  public constructor(public viewContainerRef: ViewContainerRef) {}
}
