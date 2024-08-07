import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../core/service/chat.service';
import { ApiService } from '../../core/service/api.service';
import { ApiResponse } from '../../shared/facades/api-response';
import { MessageDetails } from '../../shared/facades/chat';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ConfirmationComponent } from '../../shared/ui-component/confirmation/confirmation.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss',
})
export default class ChatRoomComponent implements OnInit, AfterViewInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageField') private messageField!: ElementRef;
  messageList = computed(() => this.chatService.messageList());
  selectedUser = computed(() => this.chatService.selectedUser());
  message = new FormControl('');
  dialogRef!: DialogRef<any, any>;
  isEditMode = false;
  editingMessage!: MessageDetails;
  constructor(
    private chatService: ChatService,
    private apiService: ApiService,
    private dialog: Dialog
  ) {
    effect(() => {
      if (this.messageList()) {
        this.scrollToBottom();
      }
    });
  }

  ngOnInit(): void {
    this.getMessages();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  getMessages() {
    this.apiService
      .post<ApiResponse<MessageDetails[]>>('users/getDiscordMessages', {
        discord_id: 1,
      })
      .subscribe((res) => {
        if (res?.data) {
          this.chatService.updateMessageList(res.data);
        }
      });
  }

  sendMessage() {
    const message = this.message.value?.trim();
    if (message && message !== '') {
      this.message.reset();
      if (this.isEditMode) {
        this.chatService.deleteUpdateMessage({
          discord_message_id: this.editingMessage.discord_message_id,
          message: message,
          type: 'update',
          user_id: this.editingMessage.user_id,
        });
        this.isEditMode = false;
      } else {
        this.chatService.sendMessage({
          message: message,
          user_id: this.selectedUser()?.user_id || 0,
          type: 'add',
        });
      }
    }
  }

  exitEditMode() {
    this.isEditMode = false;
    this.message.reset();
  }

  editMessage(message: MessageDetails) {
    this.isEditMode = true;
    this.editingMessage = {
      ...message,
    };
    this.message.setValue(message.message);
    this.messageField.nativeElement.focus();
  }

  deleteMessage(data: MessageDetails) {
    this.dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        confirmationTitle: 'Delete message?',
        confirmationMessage: `Are you sure you want to delete this message?`,
      },
    });

    this.dialogRef.closed.subscribe((res) => {
      if (res) {
        console.log('delete----------->', data);
        this.chatService.deleteUpdateMessage({
          discord_message_id: data.discord_message_id,
          message: data.message,
          type: 'delete',
          user_id: data.user_id,
        });
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
