import { ApiProperty } from '@nestjs/swagger';

export class RecipientDto {
  @ApiProperty({
    example: '2',
    description: 'Идентификатор подопечного',
    type: Number,
  })
  id: number;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя подопечного',
    type: String,
  })
  name: string;

  @ApiProperty({
    example: 'Ничего',
    description: 'Пожелание подопечного',
    type: String,
    required: false,
  })
  wish?: string;
}
