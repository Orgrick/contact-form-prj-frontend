import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { ThemesService, FormsService, CaptchaService } from '../services'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { Feedback } from '../models/feedback.models'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  providers: [ThemesService, FormsService],
})
export class ContactFormComponent implements OnInit, OnDestroy {
  @Output() messageDelivered = new EventEmitter<object>()

  btnDisabled = false
  captchaIsValid = true
  captchaUrl?: SafeUrl
  captchaCode?: string
  themes: [string?] = ['Загрузка...']
  subs: [Subscription?] = []

  feedbackForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    tel: new FormControl('', [Validators.required]),
    theme: new FormControl('Другое'),
    message: new FormControl('', Validators.required),
  })

  constructor(
    private themesService: ThemesService,
    private formsService: FormsService,
    private captchaService: CaptchaService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadThemes()

    this.loadCaptcha()

    Object.keys(this.feedbackForm.controls)
      .filter((c) => c !== 'theme')
      .forEach((control) => {
        this.subs.push(this.subToChange(control))
      })
  }

  async submit(): Promise<void> {
    this.btnDisabled = true
    const captchaCorrect: boolean = await this.submitCaptcha()
    if (!captchaCorrect) {
      this.captchaIsValid = false
      this.btnDisabled = false
      return
    }
    this.submitFeedback()
  }

  loadThemes(): void {
    this.themesService.getThemes().subscribe(
      (data: any) => {
        this.themes = data
        this.feedbackForm.controls.theme.setValue(this.themes[0])
      },
      (error) => {
        this.themes[0] = 'Другое'
        this.feedbackForm.controls.theme.setValue(this.themes[0])
      }
    )
  }

  loadCaptcha(): void {
    this.captchaService.getCaptcha().subscribe(
      (image: Blob) => {
        const captcha: string = URL.createObjectURL(image)
        this.captchaUrl = this.sanitizer.bypassSecurityTrustUrl(captcha)
        this.btnDisabled = false
      },
      (error) => {
        this.captchaUrl = '../../assets/captchaError.jpg'
        console.log(error)
      }
    )
  }

  subToChange(control: string): Subscription {
    return this.feedbackForm.controls[control].valueChanges.subscribe((val) => {
      if (control === 'tel') {
        const formatted: string = val.trim().replace(/[^+\d]/g, '')
        if (val !== formatted) {
          this.feedbackForm.controls[control].setValue(formatted)
        }
        return
      }
      if (
        (control === 'message' || control === 'name') &&
        val === val.trimStart()
      ) {
        return
      }
      if (val !== val.trim()) {
        this.feedbackForm.controls[control].setValue(val.trim())
      }
    })
  }

  submitCaptcha(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.captchaService.postCode(this.captchaCode).subscribe(
        (data: any) => {
          if (data?.success) {
            resolve(true)
            return
          }
          resolve(false)
        },
        (error) => {
          console.log(error)
          reject(false)
        }
      )
    })
  }

  submitFeedback(): void {
    const body: Feedback = {
      name: this.feedbackForm.controls.name.value,
      email: this.feedbackForm.controls.email.value,
      tel: this.feedbackForm.controls.tel.value,
      theme: this.feedbackForm.controls.theme.value,
      message: this.feedbackForm.controls.message.value,
    }
    this.formsService.postFeedback(body).subscribe(
      (data: any) => {
        if (data?.resMes) {
          this.messageDelivered.emit(data)
        }
      },
      (error) => {
        this.messageDelivered.emit(error)
      }
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub?.unsubscribe()
    })
  }
}
