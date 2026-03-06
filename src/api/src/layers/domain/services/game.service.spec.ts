import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../../application/game.service';
import { GameRepository } from '../../database/repositories/game.repository';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { Game } from '../models/game.entity';
import { User } from '../models/user.entity';
import { GameAiService } from './game-ai.serviсe';

describe('GameService', () => {
  let service: GameService;
  let gameRepo: jest.Mocked<GameRepository>;
  let userService: jest.Mocked<UserService>;

  const mockUser = { uuid: '1', login: 'user' } as User;
  const mockOpponent = { uuid: '2', login: 'opponent' } as User;
  const mockBot = {
    uuid: '00000000-0000-0000-0000-000000000000',
    login: 'AI',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: GameAiService, // Добавляем заглушку для AI
          useValue: { calculateScore: jest.fn(), getBestMove: jest.fn() },
        },
        {
          provide: GameRepository,
          useValue: {
            saveGame: jest.fn(g => Promise.resolve(g)),
            findGameById: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByUuid: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    gameRepo = module.get(GameRepository);
    userService = module.get(UserService);

    // Единая база данных для мока пользователей
    userService.findByUuid.mockImplementation(async (id: string) => {
      if (id === mockUser.uuid) return mockUser;
      if (id === mockOpponent.uuid) return mockOpponent;
      if (id === mockBot.uuid) return mockBot;
      return null;
    });
  });

  describe('createNewGame', () => {
    it('должен создать игру с AI, если пользователь найден', async () => {
      const result = await service.createNewGame(mockOpponent.uuid, 'AI');

      expect(result).toBeDefined();
      expect(result.creator.user.uuid).toBe(mockOpponent.uuid);
      expect(result.opponent?.user.uuid).toBe(mockBot.uuid);
    });
  });

  describe('joinGame', () => {
    it('должен позволить игроку присоединиться к WAITING игре', async () => {
      // Подготовка: создаем игру от лица mockUser
      const testGame = Game.create(mockUser);
      gameRepo.findGameById.mockResolvedValue(testGame);

      const result = await service.joinGame('any-id', mockOpponent.uuid);

      expect(result.opponent?.user.uuid).toBe(mockOpponent.uuid);
      expect(result.state.status).toBe('PLAYING');
    });

    it('должен выдать ошибку, если создатель пытается зайти в свою же игру', async () => {
      const testGame = Game.create(mockUser);
      gameRepo.findGameById.mockResolvedValue(testGame);

      await expect(service.joinGame('any-id', mockUser.uuid)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
