import { Component } from '@angular/core'
export interface Message {
  contactName: string
  theme: string
  content: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  message: Message = {
    contactName: '',
    theme: '',
    content: '',
  }
  constructor() {}
  messageIsSaved = true
  formHidden = false
  showModal(mes: any): void {
    this.formHidden = !this.formHidden
    // console.log(mes)
    if (mes.hasOwnProperty('resMes')) {
      const receivedMessage: Message = mes.resMes
      this.message.contactName = receivedMessage.contactName
      this.message.theme = receivedMessage.theme
      this.message.content = receivedMessage.content
      return
    }
    this.messageIsSaved = false
  }
}
