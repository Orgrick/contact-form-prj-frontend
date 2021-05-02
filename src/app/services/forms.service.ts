import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Feedback } from '../models/feedback.models'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  constructor(private http: HttpClient) {}

  postFeedback(feedback: Feedback): void {
    const body = {
      name: feedback.name,
      email: feedback.email,
      tel: feedback.tel,
      theme: feedback.theme,
      message: feedback.message,
    }
    this.http.post(`${environment.api_url}/api/Feedback`, body)
  }
}
