
type Props = {
  receiver_email: string;
  company_name: string;
  valid_till: string|boolean;
  receiver_name: string;
  standard: string;
  is_gots: boolean;
};

export class AdminExpireEmailToClientEvent {
  receiver_email: string;
  company_name: string;
  valid_till: string|boolean;
  receiver_name: string;
  standard: string;
  is_gots: boolean;

  constructor({
    receiver_email,
    valid_till,
    receiver_name,
    standard,
    is_gots,
  }: Props) {
    this.receiver_email = receiver_email;
    this.valid_till = valid_till;
    this.receiver_name = receiver_name;
    this.standard = standard;
    this.is_gots = is_gots;
  }
}
