import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserIdPrincipal = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.userUuid;
  },
);
