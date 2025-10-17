export class ReturnType<T> {
  data: T;
  message: string;
  statusCode: number;

  constructor({ data, message, statusCode }: ReturnType<T>) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
