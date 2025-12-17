export type User = {
    nick_name: string;
    email: string;
    username: string;
    avatar: string | null;
    user_status:"admin"|"basic"|"standard"|"premium"|"user"
  };