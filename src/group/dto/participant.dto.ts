import { ApiProperty } from '@nestjs/swagger';
import { RecipientDto } from './recipient.dto';

export class PartisipantDto {
  @ApiProperty({
    example: '1',
    description: 'Идентификатор участника',
    type: Number,
  })
  id: number;

  @ApiProperty({
    example: 'Алексей',
    description: 'Имя участника',
    type: String,
  })
  name: string;

  @ApiProperty({
    example: 'Кусочек тортика',
    description: 'Пожелание участника',
    type: String,
    required: false,
  })
  wish?: string;

  @ApiProperty({
    example: 'Кусочек тортика',
    description: 'Пожелание участника',
    type: String,
    required: false,
  })
  recipient?: RecipientDto;
}
