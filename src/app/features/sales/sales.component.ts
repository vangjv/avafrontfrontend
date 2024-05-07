import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TalkingHead } from '../../../assets/talkinghead/talkinghead.mjs';
import { FormsModule } from '@angular/forms';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { SpeechTokenService } from '../../services/speech-token-service';
import { AvaFrontAPIService } from '../../services/avafront-api.service';
import { environment } from '../../environments/environment';
import { Subscription, skip } from 'rxjs';
import { CommonModule } from '@angular/common';

declare var SpeechSDK: any;

// declare var TalkingHead: any;
@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [SpeechRecognitionService, SpeechTokenService, AvaFrontAPIService],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent implements OnInit, OnDestroy {
  @ViewChild('avatar') avatar!: ElementRef;
  microsoftSynthesizer!: any;
  head: any;
  speakText:string = "Hi there. How are you? I'm fine.";
  microsoftQueue: any[] = [];
  loadingText:string = "Loading...";
  buttonText:string = "Start Pitch";
  listening:boolean = false;
  thinking:boolean = false;
  pitching:boolean = false;
  subscriptions = new Subscription();
  imageUrl:string = "../assets/images/avafrontlogo.png";
  constructor(private speechRecognitionService:SpeechRecognitionService, private speechTokenService:SpeechTokenService,
    private avaFrontAPIService: AvaFrontAPIService) {
  }

  async ngOnInit() {
    this.speechTokenService.initialize().then(async () => {
      await this.initializeAvatar();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  click(){
    if (this.buttonText == "Stop") {
      this.speechRecognitionService.stopRecognition();
      this.pitching = false;
      this.head.stopSpeaking();
      this.head.start();
      this.buttonText = "Start Pitch";
    } else {
      this.startSpeaking();
      this.buttonText = "Stop";
    }
  }

  async startSpeaking() {
    console.log("Start pitch");
    this.microsoftSpeak(`

    Did you know that 88% of online consumers are less likely to return to a site after a bad experience? That could mean tens of thousands of dollars in lost sales annually. Don't let a complicated or unresponsive website be a barrier between your business and your customers.

    Enter AvaFront, the next-gen AI avatar agent, here to revolutionize your customer interactions and take your business to new heights.

    Here's the Problem: Losing Sales Due to Complicated or Overwhelming User Interfaces
    •	Did you know that 57% of consumers abandon purchases due to website usability issues.
    •	79% of customers expect companies to respond to their inquiries in under 24 hours.
    •	Over 70% of website visitors are frustrated by the lack of real-time customer support.

    We've got a Solution: AvaFront’s AI-Powered Avatar Agents
    AvaFront is here to ensure you never miss another lead or sale by offering an intuitive, human-like interaction platform that seamlessly guides customers through their journey.

    Here are a number of key Benefits and Services AvaFront Offers:
    1.	24/7 Customer Support:
    •	Answering inquiries and solving problems round the clock.
    •	Did you know that 63% of consumers are more likely to return to a website with live chat support.
    2.	Sales Support and Lead Generation:
    •	Qualify leads and boost conversions through tailored product recommendations.
    •	68% of salespeople say lead quality is their top challenge.
    3.	Personalized Conversations and Appointment Management:
    •	Recognizing returning customers and adapting conversations based on their preferences.
    •	52% of customers expect personalized offers, while 49% will switch brands due to poor personalization.
    4.	Multilingual Support and CRM Integration:
    •	Serving a global audience in multiple languages.
    •	Seamless integration with existing CRM systems ensures a unified customer experience.
    5.	Virtual Front Desk Augmentation:
    •	Enhancing your existing staff by handling overflow inquiries and peak-hour traffic.
    6.	Custom Avatar Design and Analytics:
    •	Tailoring the avatar to your brand identity.
    •	Generating actionable insights through customer interaction analytics.

    Numbers speak loud.  Here are some statistics That Matter:
    •	Did you know that 53% of customers leave a brand they love after a single poor experience.
    •	72% of customers share positive experiences with six or more people.
    •	A 5% increase in customer retention can result in a profit increase of up to 95%.

    Let us help you elevate Your Brand with AvaFront:
    •	We can help you scale your front desk services and grow your business without limits.
    •	We can help you cut customer service costs by up to 30% while boosting satisfaction.
    •	We can customize the avatar for you to fully align AvaFront with your brand's unique personality and voice.

     Don't just keep up with the competition, outpace them. Revolutionize your customer interactions with AvaFront and create a loyal customer base that returns for more.

     Contact us today to see how AvaFront can transform your customer experience.

    `);
    setTimeout(() => {
      this.pitching = true;
    }, 19000);
    setTimeout(() => {
      this.imageUrl = "../assets/images/slide1.jpg";
    }, 27000);
    setTimeout(() => {
      this.imageUrl = "../assets/images/slide2.jpg";
    }, 50000);
    setTimeout(() => {
      this.imageUrl = "../assets/images/slide3.jpg";
    }, 60000);
    setTimeout(() => {
      this.imageUrl = "../assets/images/slide4.jpg";
    }, 130000);
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
        url: 'https://models.readyplayer.me/66392780c6a3e0f03426f140.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png',
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
      const id = "en-US-DavisNeural"
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
