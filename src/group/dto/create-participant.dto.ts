import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {
  @IsString({ message: 'Имя участника должно быть строкой' })
  @IsNotEmpty({ message: 'Имя участника не должно быть пустым' })
  @ApiProperty({
    example: 'Витя',
    description: 'Имя участника',
    type: String,
  })
  name: string;

  @IsString({ message: 'Пожелание должно быть строкой' })
  @IsOptional()
  @ApiProperty({
    example: 'Всех благ',
    description: 'Пожелание участника',
    type: String,
    required: false,
  })
  wish?: string;
}
