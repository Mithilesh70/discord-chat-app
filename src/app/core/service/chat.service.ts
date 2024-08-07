import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { Socket, io } from 'socket.io-client';
import {
  MessageDetails,
  MessageDetailsSignal,
  UserDetails,
} from '../../shared/facades/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  socket!: Socket;
  selectedUser = signal<UserDetails | undefined>(undefined);
  messageList = signal<MessageDetails[]>([]);

  sendMessage(data: { message: string; user_id: number; type: string }) {
    this.socket.emit('gaming_discord', data);
  }

  deleteUpdateMessage(data: {
    message: string;
    user_id: number;
    type: string;
    discord_message_id: number;
  }) {
    this.socket.emit('gaming_discord', data);
  }

  updateMessageList(data: MessageDetails[]) {
    this.messageList.update((val) => [...val, ...data]);
  }

  startConnection() {
    this.socket = io('https://chat-app-wahk.onrender.com/', {
      query: {
        discord_code: 'gaming_discord',
      },
    });
    this.socket.io.on('open', () => {
      console.log(
        'web socket connected to https://chat-app-wahk.onrender.com/ '
      );
    });
    this.getMessages();
  }

  changeUser(data: UserDetails) {
    this.selectedUser.set(data);
  }

  getMessages() {
    this.socket.on('gaming_discord', (data: MessageDetailsSignal) => {
      console.log('data received-------------->', data);
      if (data.type === 'add') {
        this.updateMessageList([data]);
      } else {
        this.editMessageList(data);
      }
    });
  }

  editMessageList(data: MessageDetailsSignal) {
    this.messageList.update((val) => {
      val = val.map((item) =>
        item.discord_message_id === data.discord_message_id ? data : item
      );
      return val;
    });
  }
}
