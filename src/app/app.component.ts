import { Component, Directive } from '@angular/core';
import { UserService } from '@shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  constructor(private us: UserService) {}

  title = 'ng8';

  show(): void {}
}

@Component({
  selector: 'xx-editor',
  template: `
    <h1
      style="color: #f50;"
      data-long="long"
      data-long-long="long"
      data-long-long-long="long"
      data-long-long-long-long="long"
    >
      Share Editor
    </h1>
    <p style="font-size: 20px;">asdf</p>
    <ng-content></ng-content>
  `,
})
export class EditorComponent {}

@Directive({
  selector: '[xxDirective]',
})
export class CustomDirective {}

// tslint:disable-next-line: interface-name
export interface IUser {
  id: number;
}
