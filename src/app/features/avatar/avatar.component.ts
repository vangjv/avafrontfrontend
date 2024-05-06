import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TalkingHead } from '../../../assets/talkinghead/talkinghead.mjs';
import { FormsModule } from '@angular/forms';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { SpeechTokenService } from '../../services/speech-token-service';
import { AvaFrontAPIService } from '../../services/avafront-api.service';
import { environment } from '../../environments/environment';
import { Subscription, skip } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

declare var SpeechSDK: any;

// declare var TalkingHead: any;
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [SpeechRecognitionService, SpeechTokenService, AvaFrontAPIService],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent implements OnInit, OnDestroy {
  @ViewChild('avatar') avatar!: ElementRef;
  microsoftSynthesizer!: any;
  head: any;
  speakText:string = "Hi there. How are you? I'm fine.";
  microsoftQueue: any[] = [];
  loadingText:string = "Loading...";
  buttonText:string = "Start Conversation";
  listening:boolean = false;
  thinking:boolean = false;
  drawerOpen:boolean = false;
  imageUrl:string = "";
  subscriptions = new Subscription();
  constructor(private speechRecognitionService:SpeechRecognitionService, private speechTokenService:SpeechTokenService,
    private avaFrontAPIService: AvaFrontAPIService, private router:Router) {
  }

  async ngOnInit() {
    this.speechTokenService.initialize().then(async () => {
      await this.initializeAvatar();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.speechRecognitionService.stopRecognition();
  }


  closeDrawer() {
    this.drawerOpen = false;
  }

  click(){
    if (this.buttonText == "Listening") {
      this.speechRecognitionService.stopRecognition();
      this.listening = false;
      this.head.stopSpeaking();
      this.head.start();
      this.buttonText = "Start Conversation";
    } else {
      this.startRecognition();
      this.listening = true;
      this.buttonText = "Listening";
    }
  }

  async startRecognition() {
    console.log("Start recognition");
    // await this.head.playAnimation('../assets/thinking2.fbx',null,20);
    await this.speechRecognitionService.startRecognition();

    //on recognition
    this.subscriptions.add(
      this.speechRecognitionService.recognizedWords$.pipe(skip(1)).subscribe(async(recognizedWords) => {
        await this.head.playPose('../assets/thinking2.fbx',null,60);
        this.thinking = true;
        this.avaFrontAPIService.avaFrontConversation(recognizedWords).subscribe((response) => {
          if (response.action != null && response.action != "") {
            console.log("response avatarChat:", response.action);
            if (response.action == "NAVIGATETORESTAURANT") {
              this.thinking = false;
              //clear conversationId
              this.avaFrontAPIService.conversationId = "";
              this.head.stopAnimation();
              this.microsoftSpeak("Alright! Sit tight. I'll redirect you to the restaurant demo!");
              setTimeout(() => {
                this.router.navigate(['/restaurant']);
              }, 7000);
            } else if (response.action == "NAVIGATETOAUTHENTICATION") {
              this.thinking = false;
              //clear conversationId
              this.avaFrontAPIService.conversationId = "";
              this.head.stopAnimation();
              this.microsoftSpeak("Got it! I'll redirect you to the authentication demo!");
              setTimeout(() => {
                this.router.navigate(['/authentication']);
              }, 7000);
            } else if (response.action == "NAVIGATETOSALES") {
              this.thinking = false;
              //clear conversationId
              this.avaFrontAPIService.conversationId = "";
              this.head.stopAnimation();
              this.microsoftSpeak("Okay!, You're on your way to the sales demo!");
              setTimeout(() => {
                this.router.navigate(['/sales']);
              }, 7000);
            }
          } else {
            this.thinking = false;
            this.avaFrontAPIService.conversationId = response.conversationId;
            console.log("response from openAI:", response.message);
            this.head.stopAnimation();
            this.microsoftSpeak(response.message);
          }
        });
      })
    );

    this.subscriptions.add(
      this.speechRecognitionService.wordsBeingRecognized$.subscribe((wordsBeingRecognized) => {
        console.log("isSpeaking:", this.head.isSpeaking);
        console.log("isAudioPlaying:", this.head.isAudioPlaying);
        if (this.head.isSpeaking == true && wordsBeingRecognized.indexOf("stop") > -1) {
          console.log("Initiate stop speaking");
          this.head.stopSpeaking();
          this.head.start();
        }
      })
    );
  }


  createSpeechSynthesizer(): any {
    const speechConfig: any = SpeechSDK.SpeechConfig.fromAuthorizationToken(this.speechTokenService.token, environment.region);
    speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Raw22050Hz16BitMonoPcm;
    // speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
    return new SpeechSDK.SpeechSynthesizer(speechConfig);
  }

  async initializeAvatar() {
    const nodeAvatar = document.getElementById('avatar') as Object;
    this.head = new TalkingHead(nodeAvatar, {
      ttsEndpoint: "none",
      cameraView: "mid"
    });
    // Load and show the avatar
    const nodeLoading: any = document.getElementById('loading');
    try {
      await this.head.showAvatar({
        // url: 'https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png',
        url: 'https://models.readyplayer.me/663521c95363845edbfd4391.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png',
        // url: './assets/jv.glb',
        body: 'M',
        avatarMood: 'neutral',
        ttsLang: "en-GB",
        ttsVoice: "en-GB-Standard-A",
        lipsyncLang: 'en'
      }, (ev: any) => {
        if (ev.lengthComputable) {
          let val = Math.min(100, Math.round(ev.loaded / ev.total * 100));
          this.loadingText = "Loading " + val + "%";
        }
      });
      this.loadingText = '';
    } catch (error: any) {
      console.log("Error showing avatar:", error);
      nodeLoading.textContent = error.toString();
    }
  }

  speak(){
    try {
      if ( this.speakText ) {
        this.microsoftSpeak( this.speakText, this.head );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async microsoftSpeak(s: any, node = null) {
    if (s === null) {
      this.microsoftQueue.push(null);
    } else {

      // Voice config
      //const id = "en-US-JasonNeural";
      const id = "en-US-BrianMultilingualNeural"
      const lang = "en-US";

      // SSML
      // const ssml = "<speak version='1.0' " +
      //   "xmlns:mstts='http://www.w3.org/2001/mstts' " +
      //   "xml:lang='" + lang + "'>" +
      //   "<voice name='" + id + "'>" +
      //   "<mstts:viseme type='redlips_front'/>" +
      //   s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') +
      //   "</voice>" +
      //   "</speak>";

        // SSML
      const ssml = "<speak version='1.0' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'><voice name='" + id + "'><mstts:viseme type='redlips_front'/><prosody rate='+25%'>" + s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') + "</prosody></voice></speak>";

      this.microsoftQueue.push({
        ssml: ssml,
        node: node,
        speak: { audio: [], words: [], wtimes: [], wdurations: [], visemes: [], vtimes: [], vdurations: [] }
      });
    }

    // If this was the first item, start the process
    if (this.microsoftQueue.length === 1) {
      this.microsoftProcessQueue();
    }
  }

  async microsoftProcessQueue() {

    if (this.microsoftQueue.length) {

      const job = this.microsoftQueue[0];

      if (job === null) {
        this.microsoftQueue.shift();
        if (this.microsoftQueue.length === 0 && this.microsoftSynthesizer) {
          this.microsoftSynthesizer.close();
          this.microsoftSynthesizer = null;
        }
      } else {

        // If we do not a speech synthesizer, create a new
        if (!this.microsoftSynthesizer) {

          this.microsoftSynthesizer = this.createSpeechSynthesizer();

          // Viseme conversion from Microsoft to Oculus
          // TODO: Check this conversion again!
          const visemeMap = [
            "sil", 'aa', 'aa', 'O', 'E', // 0 - 4
            'E', 'I', 'U', 'O', 'aa', // 5 - 9
            'O', 'I', 'kk', 'RR', 'nn', // 10 - 14
            'SS', 'SS', 'TH', 'FF', 'DD', // 15 - 19
            'kk', 'PP' // 20 - 21
          ];

          // Process visemes
          this.microsoftSynthesizer.visemeReceived = (s:any, e:any) => {
            if (this.microsoftQueue[0] && this.microsoftQueue[0].speak) {
              const o = this.microsoftQueue[0].speak;
              const viseme = visemeMap[e.visemeId];
              const time = e.audioOffset / 10000;

              // Calculate the duration of the previous viseme
              if (o.vdurations.length) {

                if (o.visemes[o.visemes.length - 1] === 0) {
                  o.visemes.pop();
                  o.vtimes.pop();
                  o.vdurations.pop();
                } else {
                  // Remove silence
                  o.vdurations[o.vdurations.length - 1] = time - o.vtimes[o.vdurations.length - 1];
                }
              }
              // Add this viseme
              o.visemes.push(viseme);
              o.vtimes.push(time);
              o.vdurations.push(75); // Duration will be fixed when the next viseme is received
            }
          };

          // Process word boundaries and punctuations
          this.microsoftSynthesizer.wordBoundary = (s:any, e:any) => {
            if (this.microsoftQueue[0] && this.microsoftQueue[0].speak) {
              const o = this.microsoftQueue[0].speak;
              const word = e.text;
              const time = e.audioOffset / 10000;
              const duration = e.duration / 10000;

              if (e.boundaryType === "PunctuationBoundary" && o.words.length) {
                o.words[o.words.length - 1] += word;
              } else if (e.boundaryType === "WordBoundary" || e.boundaryType === "PunctuationBoundary") {
                o.words.push(word);
                o.wtimes.push(time);
                o.wdurations.push(duration);
              }
            }
          };
        }

        // Speak the SSML
        this.microsoftSynthesizer.speakSsmlAsync(job.ssml,
          (result:any) => {
            if (this.microsoftQueue[0] && this.microsoftQueue[0].speak) {
              if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                const job = this.microsoftQueue[0];
                job.speak.audio.push(result.audioData);
                this.head.speakAudio(job.speak, {}, job.node ? console.log("job.node:", job.node) : null);
              }
              this.microsoftQueue.shift();
              this.microsoftProcessQueue();
            }
          }, (err:any) => {
            console.log(err);
            this.microsoftQueue.shift();
            this.microsoftProcessQueue();
          }
        );

      }
    }
  }
}
