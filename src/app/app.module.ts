import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  StreamChatModule,
  StreamAutocompleteTextareaModule,
} from 'stream-chat-angular';
import { ChannelListComponent } from './channel-list/channel-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InsideLayoutComponent } from './inside-layout/inside-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [AppComponent, ChannelListComponent, LoginComponent, InsideLayoutComponent, DashboardComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    StreamAutocompleteTextareaModule,
    StreamChatModule,
    TranslateModule.forRoot(),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
