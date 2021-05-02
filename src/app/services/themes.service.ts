import { Injectable } from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ThemesService {
  constructor(private http: HttpClient) {}
  getThemes(): Observable<object> {
    return this.http.get(`${environment.api_url}/themes`)
  }
}
