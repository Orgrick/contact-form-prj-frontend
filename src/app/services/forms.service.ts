import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Feedback } from '../models/feedback.models'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'
@Injectable({
  providedIn: 'root',
})
export class FormsService {
  constructor(private http: HttpClient) {}

  postFeedback(feedback: Feedback): Observable<object> {
    const body = {
      name: feedback.name,
      email: feedback.email,
      tel: feedback.tel,
      theme: feedback.theme,
      message: feedback.message,
    }
    return this.http.post(`${environment.api_url}/Feedback`, body, {})
  }
}
