import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppComponent } from './app.component'
import { ContactFormComponent } from './contact-form/contact-form.component'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { NgxMaskModule, IConfig } from 'ngx-mask'

// @ts-ignore
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null

@NgModule({
  declarations: [AppComponent, ContactFormComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
