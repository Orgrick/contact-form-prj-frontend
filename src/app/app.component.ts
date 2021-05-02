import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  formHidden = false
  hideForm(): void {
    this.formHidden = !this.formHidden
  }
}
