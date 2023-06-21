
type Props = {
  app_link: string
  name_bn?: string;
  receiver_email: string;
  receiver_name?: string;
  code: any;
};

export class TeacherOtpEmailEvent {
  name_bn?: string;
  receiver_email: string;
  receiver_name?: string;
  code: any;
  app_link;

  constructor({
    name_bn,
    receiver_email,
    receiver_name,
    code,
    app_link,
  }: Props) {
    this.name_bn = name_bn;
    this.receiver_email = receiver_email;
    this.receiver_name = receiver_name;
    this.code = code;
    this.app_link = app_link;
  }
}
