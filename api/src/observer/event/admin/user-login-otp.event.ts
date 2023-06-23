type Props = {
  receiver_email: string;
  receiver_name?: string;
  reset_code: any;
};

export class UserLoginOtpEvent {

  receiver_email: string;
  receiver_name?: string;
  reset_code: any;

  constructor({ receiver_email, receiver_name, reset_code }: Props) {
    this.receiver_email = receiver_email;
    this.receiver_name = receiver_name;
    this.reset_code = reset_code;
    // console.log(reset_code);
  }
}
