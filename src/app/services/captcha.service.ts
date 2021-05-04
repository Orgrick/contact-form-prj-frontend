import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  constructor(private http: HttpClient) {}
  getCaptcha(): Observable<any> {
    return this.http.get(`${environment.api_url}/Captcha`, {
      responseType: 'blob',
    })
  }

  postCode(code?: string): Observable<object> {
    const body = {
      key: code ?? 'empty',
    }
    console.log(body)
    return this.http.post(`${environment.api_url}/Captcha`, body, {})
  }
}
