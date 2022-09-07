import { AuthService } from './../services/auth.service';
import { environment } from 'src/environments/environment';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ChatClientService,
  ChannelService,
  StreamI18nService,
  ThemeService,
  CustomTemplatesService,
  MessageContext,
} from 'stream-chat-angular';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss'],
})
export class ChannelListComponent implements OnInit, OnDestroy, AfterViewInit {
  chatReady = false;
  channelName = '';
  observables = new Subscription();
  searchUser = '';
  foundUsers: any[] = [];
  addUser = '';

  @ViewChild('message')
  private customMessage?: TemplateRef<MessageContext>;

  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private authService: AuthService,
    private themeService: ThemeService,
    private customTemplatesService: CustomTemplatesService
  ) {
    this.loadUser();
  }
  async ngOnInit() {}

  ngAfterViewInit(): void {
    // this.customTemplatesService.messageTemplate$.next(this.customMessage);
  }

  loadUser() {
    const obs = this.authService.getCurrentUser().subscribe((user: any) => {
      if (user) {
        this.chatService.init(
          environment.streamKey,
          `${user.id}`,
          user.stream_token
        );
        this.streamI18nService.setTranslation();

        this.initChat();
      }
    });
    this.observables.add(obs);
  }

  async initChat() {
    await this.channelService.init({
      type: 'messaging',
      members: { $in: [this.authService.getCurrentUserId()] },
    });
    this.chatReady = true;
  }

  async createChannel() {
    const channelId = `${Date.now()}-${this.authService.getCurrentUserId()}`;

    const channel = this.chatService.chatClient.channel(
      'messaging',
      channelId,
      {
        image:
          'https://pbs.twimg.com/profile_images/1564203599747600385/f6Lvcpcu_400x400.jpg',
        name: this.channelName,
        members: [this.authService.getCurrentUserId()],
      }
    );
    await channel.create();
    this.channelName = '';
  }

  toggleLight() {
    const current = this.themeService.theme$.getValue();
    if (current === 'light') {
      this.themeService.theme$.next('dark');
    } else {
      this.themeService.theme$.next('light');
    }
  }

  searchForUser() {
    this.chatService.autocompleteUsers(this.searchUser).then((res) => {
      console.log(res);
      this.foundUsers = res;
    });
  }

  onSelect() {
    this.channelService.activeChannel$.pipe(take(1)).subscribe((channel) => {
      if (channel) {
        channel.addMembers([this.addUser]);
      }
    });
  }

  ngOnDestroy(): void {
    this.observables.unsubscribe();
  }
}
