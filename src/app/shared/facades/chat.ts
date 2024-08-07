export interface UserDetails {
  user_id: number;
  user_name: string;
  user_status: string;
  discord_id: number;
  discord_name: string;
}

export interface MessageDetails {
  message: string;
  discord_id: number;
  user_id: number;
  user_name: string;
  discord_message_id: number;
  is_delete: number;
}

export interface MessageDetailsSignal extends MessageDetails {
  type: string;
}
