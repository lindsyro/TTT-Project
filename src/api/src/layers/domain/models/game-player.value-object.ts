import { User } from './user.entity';

/**
 * Оппонент AI_USER
 */
export const AI_USER = new User(
  '00000000-0000-0000-0000-000000000000',
  'AI-bot',
  '',
);

/**
 * Описывает игрока
 */
export interface GamePlayer {
  user: User;
  icon: 'X' | 'O';
}
