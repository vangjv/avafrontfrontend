export class ConversationRequest {
  message: string;
  public constructor (message: string) {
    this.message = message;
  }
}

export interface ConversationResponse {
  message: string;
  action: string;
  conversationId: string;
}
