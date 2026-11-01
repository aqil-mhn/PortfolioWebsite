import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContactApi } from '../../core/contact-api';
import { SITE } from '../../core/site';
import { PageHead } from '../../shared/page-head';

type SendState = 'idle' | 'sending' | 'sent' | 'failed';
type Field = 'name' | 'email' | 'message';

const FIELD_ORDER: readonly Field[] = ['name', 'email', 'message'];

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink, PageHead],
  templateUrl: './contact.html',
  host: { class: 'cols' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private readonly api = inject(ContactApi);
  private readonly document = inject(DOCUMENT);

  protected readonly site = SITE;
  protected readonly state = signal<SendState>('idle');

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  /** True once the visitor has left the field or tried to send. */
  protected showError(field: Field): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  protected async submit(): Promise<void> {
    if (this.state() === 'sending') {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const first = FIELD_ORDER.find((field) => this.form.controls[field].invalid);
      this.document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    this.state.set('sending');
    try {
      await this.api.send(this.form.getRawValue());
      this.form.reset();
      this.state.set('sent');
    } catch {
      this.state.set('failed');
    }
  }
}
