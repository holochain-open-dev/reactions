export interface ReactionsConfig {
  zomeName: string;
  avatarMode: 'identicon' | 'avatar';
  additionalFields: string[];
  minNicknameLength: number;
}

export const defaultConfig: ReactionsConfig = {
  zomeName: 'reactions',
  avatarMode: 'avatar',
  additionalFields: [],
  minNicknameLength: 3,
};
