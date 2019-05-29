import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  AB = 1;
  a = 2;
  AA() {
    console.log('aa');
  }
}
