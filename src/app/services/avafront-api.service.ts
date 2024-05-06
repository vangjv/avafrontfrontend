import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ConversationRequest, ConversationResponse } from '../models/conversation-req-res.model';

@Injectable({
  providedIn: 'root'
})
export class AvaFrontAPIService {
  private apiUrl = environment.avaFrontApiEndpoint;
  public conversationId: string = "";
  constructor(private http: HttpClient) { }

  postConversation(conversationId: string, message:string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    .set('ConversationId', conversationId);
    return this.http.post<ConversationResponse>(`${this.apiUrl}/openai`, new ConversationRequest(message), { headers });
  }

  restaurantConversation(message:string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    .set('ConversationId', this.conversationId);
    return this.http.post<ConversationResponse>(`${this.apiUrl}/restaurantchat`, new ConversationRequest(message), { headers });
  }

  avaFrontConversation(message:string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    .set('ConversationId', this.conversationId);
    return this.http.post<ConversationResponse>(`${this.apiUrl}/avafrontchat`, new ConversationRequest(message), { headers });
  }

}
