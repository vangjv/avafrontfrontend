import { Injectable } from '@angular/core';
import { ResultReason, SpeechConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';
import { environment } from '../environments/environment';
import { SpeechTokenService } from './speech-token-service';
import { BehaviorSubject } from 'rxjs';
;

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private speechConfig: SpeechConfig;
  private speechRecognizer!: SpeechRecognizer;
  private wordsBeingRecognized:BehaviorSubject<string> = new BehaviorSubject<string>('');
  wordsBeingRecognized$ = this.wordsBeingRecognized.asObservable();
  private recognizedWords:BehaviorSubject<string> = new BehaviorSubject<string>('');
  recognizedWords$ = this.recognizedWords.asObservable();

  constructor(private speechTokenService: SpeechTokenService) {
    // this.speechConfig = SpeechConfig.fromSubscription(environment.subscriptionKey, environment.region);
    this.speechConfig = SpeechConfig.fromAuthorizationToken(speechTokenService.token, environment.region);
  }

  async startRecognition(): Promise<void> {
    if (this.speechConfig.authorizationToken === undefined) {
      await this.speechTokenService.initialize();
      this.speechConfig = SpeechConfig.fromAuthorizationToken(this.speechTokenService.token, environment.region);
    }
    console.log("speechToken", this.speechConfig.authorizationToken);
    this.speechRecognizer = new SpeechRecognizer(this.speechConfig);

    this.speechRecognizer.recognizing = (s, e) => {
      console.log('Recognizing:', e.result.text);
      this.wordsBeingRecognized.next(e.result.text);
    };

    this.speechRecognizer.recognized = (s, e) => {
      if (e.result.reason === ResultReason.RecognizedSpeech) {
        console.log('Recognized:', e.result.text);
        this.recognizedWords.next(e.result.text);
      } else if (e.result.reason === ResultReason.NoMatch) {
        console.log('No speech could be recognized');
      }
    };

    this.speechRecognizer.canceled = (s, e) => {
      console.log('Canceled:', e);
    };

    this.speechRecognizer.sessionStopped = (s, e) => {
      console.log('Session stopped');
    };

    await this.speechRecognizer.startContinuousRecognitionAsync();
  }

  stopRecognition(): void {
    this.speechRecognizer.stopContinuousRecognitionAsync();
  }
}
