export class ChatConversation {
    messages: ChatMessage[] = [];
    constructor() {
      this.messages = [];
    }
}

export class ChatMessage {
    role: AIChatRole;
    content: string;
    constructor(role: AIChatRole, content: string) {
        this.role = role;
        this.content = content;
    }
}

export enum AIChatRole {
    User = "User",
    System = "System",
    Assistant = "Assistant"
}
