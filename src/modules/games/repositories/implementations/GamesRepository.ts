import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const results = await this.repository
      .createQueryBuilder('game')
      .select("games")
      .from(Game, "games")
      .where(`LOWER(games.title) ILIKE :title`, { title: `%${param}%`.toLowerCase() })
      .getMany()

    console.log(results)
    return results
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(id) from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository.findOne(id)

    const users = await this.repository
    .createQueryBuilder()
    .relation(Game, "users")
    .of(game)
    .loadMany();

    return users
    
    // Complete usando query builder
  }
}
