export class HttpError extends Error {

  public status: number;
  public data?: any;

  constructor(public message: string, status?: number, data?: any) {
    super(message);
    this.status = status || 500;
    this.data = data;
  }
}
