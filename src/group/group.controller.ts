import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GroupDto } from './dto/group.dto';
import { GetGroupDto } from './dto/get-groups.dto';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Controller('group')
@ApiTags('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiCreatedResponse({
    type: Number,
    description: 'Группа была успешно создана',
  })
  @ApiBadRequestResponse({
    description: 'Проблемы с телом запроса (отсутствует название)',
  })
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @ApiOkResponse({
    type: [GetGroupDto],
    description: 'Получен список групп',
  })
  @Get()
  findAll(): Promise<GetGroupDto[]> {
    return this.groupService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: GroupDto,
    description: 'Получена группа',
  })
  @ApiBadRequestResponse({
    description: 'Некорректный id группы',
  })
  @ApiNotFoundResponse({
    description: 'Группа не найдена',
  })
  findOne(@Param('id') id: string): Promise<GroupDto> {
    return this.groupService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Группа обновлена',
  })
  @ApiBadRequestResponse({
    description: 'Некорректный id группы',
  })
  @ApiNotFoundResponse({
    description: 'Группа не найдена',
  })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Группа удалена',
  })
  @ApiBadRequestResponse({
    description: 'Некорректный id группы',
  })
  @ApiNotFoundResponse({
    description: 'Группа не найдена',
  })
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }

  @Post(':id/participant')
  @ApiCreatedResponse({
    type: Number,
    description: 'Участник был успешно создан',
  })
  @ApiBadRequestResponse({
    description:
      'Некорректный id группы или проблемы с телом запроса (отсутствует имя)',
  })
  @ApiNotFoundResponse({
    description: 'Группа не найдена',
  })
  addParticipant(
    @Param('id') id: string,
    @Body() createParticipantDto: CreateParticipantDto,
  ) {
    return this.groupService.addParticipant(id, createParticipantDto);
  }

  @Delete(':groupId/participant/:participantId')
  @ApiOkResponse({
    description: 'Участник удален',
  })
  @ApiBadRequestResponse({
    description: 'Некорректный id группы или участника',
  })
  @ApiNotFoundResponse({
    description: 'Группа или участник не найдены',
  })
  removeParticipant(
    @Param('groupId') groupId: string,
    @Param('participantId') participantId: string,
  ) {
    return this.groupService.removeParticipant(groupId, participantId);
  }

  @Post(':id/toss')
  @ApiCreatedResponse({
    type: Number,
    description: 'Жеребьевка проведена',
  })
  @ApiBadRequestResponse({
    description:
      'Некорректный id группы или проблемы с телом запроса (отсутствует имя)',
  })
  @ApiConflictResponse({
    description:
      'Не удалось произвести розыгрыш, количество участников меньше 3',
  })
  @ApiNotFoundResponse({
    description: 'Группа не найдена',
  })
  toss(@Param('id') id: string) {
    return this.groupService.toss(id);
  }

  @Get(':groupId/participant/:participantId/recipient')
  @ApiOkResponse({
    description: 'Получен подопечный',
  })
  @ApiBadRequestResponse({
    description: 'Некорректный id группы или участника',
  })
  @ApiNotFoundResponse({
    description: 'Группа или участник не найдены',
  })
  getRecipient(
    @Param('groupId') groupId: string,
    @Param('participantId') participantId: string,
  ) {
    return this.groupService.getRecipient(groupId, participantId);
  }
}
