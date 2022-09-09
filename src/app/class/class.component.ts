import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelService, ChatClientService } from 'stream-chat-angular';
import data from '../../assets/classes.json';
import { take } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { StreamService } from '../services/stream.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent implements OnInit {
  class: any;
  joinedChat = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private streamService: StreamService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('classid');

    this.class = data.classes.filter((item: any) => item.id == id)[0];

    this.streamService.isStreamReady().subscribe((ready: boolean) => {
      if (ready) {
        this.loadChat();
      }
    });
  }

  loadChat() {
    this.channelService.channels$.subscribe((channels) => {
      if (!channels) return;

      const filtered = channels.filter(
        (channel) => channel.id == this.class.id
      );

      if (filtered.length) {
        // User is already member
        const toJoin = filtered[0];

        this.channelService.setAsActiveChannel(toJoin);
        this.joinedChat = true;
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  async joinClassChat() {
    this.spinner.show();

    const channel = await this.chatService.chatClient.getChannelById(
      'messaging',
      this.class.id,
      {}
    );

    await channel.addMembers([this.authService.getCurrentUserId()]);

    this.spinner.hide();
    this.loadChat();
  }

  leaveClassChat() {
    this.channelService.activeChannel$.pipe(take(1)).subscribe((channel) => {
      if (channel) {
        channel.removeMembers([this.authService.getCurrentUserId()]);
        this.joinedChat = false;
      }
    });
  }
}
