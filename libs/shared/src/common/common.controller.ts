// 外部依赖
import {
  ApiHeader,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

/**
 * 通用控制器基类
 *
 * 用于配置通用的swagger配置
 */
@ApiHeader({
  name: 'token',
  description: '用户令牌',
  required: true,
  example: 'abcdefg',
})
@ApiUnauthorizedResponse({
  description: '未授权',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: '用户令牌验证无效' },
      error: { type: 'string', example: 'Unauthorized' },
      statusCode: { type: 'number', example: 401 },
    },
  },
})
@ApiForbiddenResponse({
  description: '禁止访问',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: '用户未授权使用该接口' },
      error: { type: 'string', example: 'Forbidden' },
      statusCode: { type: 'number', example: 403 },
    },
  },
})
@ApiNotFoundResponse({
  description: '未找到相关资源',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: '未找到相关资源' },
      error: { type: 'string', example: 'NotFound' },
      statusCode: { type: 'number', example: 404 },
    },
  },
})
export class CommonController {}
