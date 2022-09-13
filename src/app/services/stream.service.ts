import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {
  ChannelService,
  ChatClientService,
  StreamI18nService,
} from 'stream-chat-angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  private streamReady = new BehaviorSubject(false);

  constructor(
    private authService: AuthService,
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService
  ) {
    this.authService.getCurrentUser().subscribe((user: any) => {
      if (user && user.stream_token) {
        this.chatService.init(
          environment.streamKey,
          `${user.id}`,
          user.stream_token
        );
        this.streamI18nService.setTranslation();
        this.initChat();
      } else {
        if (this.chatService.chatClient) {
          this.chatService.disconnectUser();
          this.channelService.reset();
        }

        this.streamReady.next(false);
      }
    });
  }

  async initChat() {
    await this.channelService.init({
      type: 'messaging',
      members: { $in: [this.authService.getCurrentUserId()] },
    });
    this.streamReady.next(true);
  }

  isStreamReady() {
    return this.streamReady.asObservable();
  }
}
