import { Injectable } from '@angular/core';
import { SITE } from './site';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/** Posts the contact form as JSON to the endpoint in SITE. Rejects while none is configured. */
@Injectable({ providedIn: 'root' })
export class ContactApi {
  async send(message: ContactMessage): Promise<void> {
    if (!SITE.contactEndpoint) {
      throw new Error('No contact endpoint is configured yet.');
    }
    const response = await fetch(SITE.contactEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      throw new Error(`The contact endpoint answered ${response.status}.`);
    }
  }
}
