import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartisipantDto } from './participant.dto';

export class GetGroupDto {
  @ApiProperty({
    example: '1',
    description: 'Идентификатор группы',
    type: Number,
  })
  id: number;

  @ApiProperty({
    example: 'Хорошая группа',
    description: 'Название группы',
    type: String,
  })
  name: string;

  @ApiProperty({
    example: 'Самая первая группа',
    description: 'Описание группы',
    type: String,
    required: false,
  })
  description?: string;
}
