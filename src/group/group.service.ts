import { GroupDto } from './dto/group.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetGroupDto } from './dto/get-groups.dto';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}
  async create(createGroupDto: CreateGroupDto) {
    const group = await this.prisma.group.create({ data: createGroupDto });
    return group.id;
  }

  findAll(): Promise<GetGroupDto[]> {
    return this.prisma.group.findMany({
      select: { id: true, description: true, name: true },
    });
  }

  async findOne(id: string): Promise<GroupDto> {
    const groupId = await this.checkGroup(id);
    return this.prisma.group.findUnique({
      where: { id: groupId },
      select: {
        id: true,
        description: true,
        name: true,
        participants: {
          select: {
            id: true,
            name: true,
            wish: true,
            recipient: { select: { id: true, name: true, wish: true } },
          },
        },
      },
    });
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const groupId = await this.checkGroup(id);
    this.prisma.group.update({
      data: {
        name: updateGroupDto.name,
        description: updateGroupDto.description
          ? updateGroupDto.description
          : null,
      },
      where: { id: groupId },
    });
  }

  async remove(id: string) {
    const groupId = await this.checkGroup(id);
    this.prisma.participant.deleteMany({
      where: {
        groupId,
      },
    });
    this.prisma.group.delete({
      where: { id: groupId },
    });
  }

  async addParticipant(id: string, createParticipantDto: CreateParticipantDto) {
    const groupId = await this.checkGroup(id);
    const participant = await this.prisma.participant.create({
      data: { ...createParticipantDto, groupId },
    });
    return participant.id;
  }

  async removeParticipant(groupId: string, participantId: string) {
    const id = await this.checkGroup(groupId);
    const partisId = await this.checkParticipant(participantId);
    await this.prisma.participant.updateMany({
      data: {
        recipientId: null,
      },
      where: {
        recipientId: partisId,
      },
    });
    await this.prisma.participant.delete({
      where: { id: partisId },
    });
  }

  async toss(groupId: string) {
    const id = await this.checkGroup(groupId);
    const participants = await this.prisma.participant.findMany({
      where: {
        groupId: id,
      },
    });
    if (participants.length < 3)
      throw new HttpException(
        'Количество участников меньше 3',
        HttpStatus.CONFLICT,
      );
    for (let i = 0; i < participants.length; i++) {
      await this.prisma.participant.update({
        data: {
          recipientId: null,
        },
        where: {
          id: participants[i].id,
        },
      });
    }
    this.shuffle(participants);
    for (let i = 0; i < participants.length - 1; i++) {
      await this.prisma.participant.update({
        data: {
          recipientId: participants[i].id,
        },
        where: {
          id: participants[i + 1].id,
        },
      });
    }

    await this.prisma.participant.update({
      data: {
        recipientId: participants[participants.length - 1].id,
      },
      where: {
        id: participants[0].id,
      },
    });
    return this.prisma.participant.findMany({
      where: { groupId: id },
      select: {
        id: true,
        name: true,
        wish: true,
        recipient: {
          select: {
            id: true,
            name: true,
            wish: true,
          },
        },
      },
    });
  }

  async getRecipient(groupId: string, participantId: string) {
    const id = await this.checkGroup(groupId);
    const partisId = await this.checkParticipant(participantId);
    return this.prisma.participant.findUnique({
      where: { id: partisId },
      select: {
        recipient: {
          select: {
            id: true,
            name: true,
            wish: true,
          },
        },
      },
    });
  }

  async checkGroup(id: string): Promise<number> {
    const groupId = Number(id);
    if (isNaN(groupId))
      throw new HttpException(
        'Не корректный id группы',
        HttpStatus.BAD_REQUEST,
      );
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group)
      throw new HttpException(
        'Группа с данным id не найдена',
        HttpStatus.NOT_FOUND,
      );
    return groupId;
  }
  async checkParticipant(id: string): Promise<number> {
    const participantId = Number(id);
    if (isNaN(participantId))
      throw new HttpException(
        'Не корректный id участника',
        HttpStatus.BAD_REQUEST,
      );
    const participant = await this.prisma.participant.findUnique({
      where: { id: participantId },
    });
    if (!participant)
      throw new HttpException(
        'Участник с данным id не найдена',
        HttpStatus.NOT_FOUND,
      );
    return participantId;
  }

  shuffle(array) {
    let i = 0;
    let j = 0;
    let temp = null;
    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
}
