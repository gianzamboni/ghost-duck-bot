export class PermissionError {

  public message: string;

  constructor(replyMessage: string) {
    this.message = replyMessage
  };
}