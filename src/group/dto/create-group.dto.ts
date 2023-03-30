import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @IsString({ message: 'Название группы должно быть строкой' })
  @IsNotEmpty({ message: 'Название группы не должно быть пустым' })
  @ApiProperty({
    example: 'Хорошая группа',
    description: 'Название группы',
    type: String,
  })
  name: string;

  @IsString({ message: 'Описание группы должно быть строкой' })
  @IsOptional()
  @ApiProperty({
    example: 'Самая первая группа',
    description: 'Описание группы',
    type: String,
    required: false,
  })
  description?: string;
}
