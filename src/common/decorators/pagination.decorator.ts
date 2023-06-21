import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { page = 1, limit = 10 } = request.query;
    let pageNo = parseInt("" + page) || 1;
    if (pageNo < 1) pageNo = 1;
    const limitData = parseInt("" + limit) || 0;
    const skip = (pageNo - 1) * limitData;
    return {
      page: pageNo,
      limit: limitData,
      skip: skip,
    };
  }
);
