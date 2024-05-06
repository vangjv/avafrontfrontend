import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechTokenService {
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  token$ = this.tokenSubject.asObservable();
  token!: string;

  constructor(private http: HttpClient) {
    this.fetchToken();
  }

  fetchToken(): void {
    this.http.get('https://avafrontapi.azurewebsites.net/api/speech/token', { responseType: 'text' })
      .subscribe(token => {
        this.tokenSubject.next(token);
        this.token = token;
      });
  }

  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get('https://avafrontapi.azurewebsites.net/api/speech/token', { responseType: 'text' })
      .subscribe(token => {
        console.log("Speech token fetched:", token);
        this.token = token;
        this.tokenSubject.next(token);
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
}
