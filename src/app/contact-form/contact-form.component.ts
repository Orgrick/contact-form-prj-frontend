import { Component, OnDestroy, OnInit } from '@angular/core'
import { ThemesService } from '../services/themes.service'
import { FormsService } from '../services/forms.service'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  providers: [ThemesService, FormsService],
})
export class ContactFormComponent implements OnInit, OnDestroy {
  constructor(private themesService: ThemesService) {}

  themes: [string?] = ['Загрузка...']

  private subs: [Subscription?] = []

  feedbackForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    tel: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$'
      ),
    ]),
    theme: new FormControl(null),
    message: new FormControl('', Validators.required),
  })

  changeName(): void {
    this.feedbackForm.controls.name.setValue(
      this.feedbackForm.controls.name.value.trim()
    )
  }

  ngOnInit(): void {
    this.themesService.getThemes().subscribe(
      (data: any) => (this.themes = data),
      (error) => (this.themes[0] = 'Другое')
    )

    Object.keys(this.feedbackForm.controls)
      .filter((c) => c !== 'theme')
      .forEach((control) => {
        this.subs.push(this.subToChange(control))
      })
    // this.subs.push(this.subToChange('theme'))
  }

  subToChange(control: string): Subscription {
    console.log('sub to change ' + control)
    return this.feedbackForm.controls[control].valueChanges.subscribe((val) => {
      console.log('input value ' + control + val)
      if (val !== val.trim()) {
        this.feedbackForm.controls[control].setValue(val.trim())
      }
      if (control === 'tel') {
        const formatted: string = val.trim().replace(/[^+\d]/g, '')
        if (val !== formatted) {
          this.feedbackForm.controls[control].setValue(formatted)
        }
      }
    })
  }

  submit(): void {}

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub?.unsubscribe()
      console.log('unsub to: ')
      console.log(sub)
    })
  }
}
