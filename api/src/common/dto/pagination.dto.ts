export class PaginationDto {
  public readonly page: number;
  public readonly limit: number;
  public readonly skip: number;
  constructor(obj: { page?: string | number; limit: string | number }) {
    const { page = "1", limit } = obj;
    this.page = parseInt("" + page) || 1;
    if (this.page < 1) this.page = 1;
    (this.limit = parseInt("" + limit) || 10),
      (this.skip = (this.page - 1) * this.limit);
  }
}
