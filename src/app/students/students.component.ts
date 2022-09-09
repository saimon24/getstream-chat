import { Router } from '@angular/router';
import { ChatClientService, ChannelService } from 'stream-chat-angular';
import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import {
  concat,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { UserResponse } from 'stream-chat';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent {
  channelName = '';
  selectedUser = null;
  foundUsers: Observable<UserResponse[]>;
  userInput = new Subject<string>();

  constructor(
    private authService: AuthService,
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private router: Router
  ) {
    this.foundUsers = concat(
      of([]),
      this.userInput.pipe(
        distinctUntilChanged(),
        switchMap((term) => this.chatService.autocompleteUsers(term))
      )
    );
  }

  async onSelect() {
    const channelId = `${Date.now()}-${this.authService.getCurrentUserId()}`;

    const channel = this.chatService.chatClient.channel(
      'messaging',
      channelId,
      {
        image:
          'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
        name: this.channelName,
        members: [this.authService.getCurrentUserId(), this.selectedUser!],
      }
    );

    await channel.create();

    this.channelName = '';

    channel.watch().then((_) => {
      this.channelService.setAsActiveChannel(channel);
      this.router.navigateByUrl('/app/chats');
    });
  }
}
