import { Injectable } from '@nestjs/common';
import { GameMapper } from '../mappers/game.mapper';
import { GameDatasource } from '../models/game.datasource';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UserDatasource } from '../models/user.datasource';
import { Game } from 'src/layers/domain/models/game.entity';

@Injectable()
export class GameRepository {
  constructor(
    @InjectModel(GameDatasource)
    private readonly gameData: typeof GameDatasource,
    private readonly mapper: GameMapper,
  ) {}

  /**
   * Сохранение или обновление игры
   */
  async saveGame(game: Game): Promise<Game> {
    const entityData = this.mapper.toDatasource(game);

    const [instance] = await this.gameData.upsert(entityData, {
      returning: true,
    });

    instance.changed('board', true);
    instance.changed('state', true);
    
    await instance.save();

    const updatedGame = await this.findGameById(game.uuid);

    if (!updatedGame) {
      throw new Error(
        `Ошибка синхронизации: игра ${game.uuid} не найдена после сохранения`,
      );
    }

    return updatedGame;
  }

  async findAvailableGames(userId: string): Promise<Game[]> {
    const entities = await this.gameData.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { 'state.status': 'WAITING' },
              { 'state.status': 'PLAYING' },
            ],
          },
          {
            [Op.or]: [
              { userId: userId },
              { opponentId: userId },
              { opponentId: null },
            ],
          },
        ],
      },
      include: [
        { model: UserDatasource, as: 'creator' },
        { model: UserDatasource, as: 'opponent' },
      ],
      order: [['updatedAt', 'DESC']],
    });

    return entities.map(entity => this.mapper.toDomain(entity));
  }

  async findGameById(id: string): Promise<Game | null> {
    const entity = await this.gameData.findOne({
      where: { uuid: id },
      include: [
        { model: UserDatasource, as: 'creator' },
        { model: UserDatasource, as: 'opponent' },
      ],
    });

    if (!entity) return null;

    return this.mapper.toDomain(entity);
  }

  /**
   * Очистка всех игр, связанных с конкретным пользователем
   */
  async deleteUsersGames(id: string): Promise<number> {
    return await this.gameData.destroy({
      where: {
        [Op.or]: [{ userId: id }, { opponentId: id }],
      },
    });
  }
}
