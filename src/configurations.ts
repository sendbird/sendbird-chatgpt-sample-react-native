export const APP_ID = 'BDD627AC-AC88-45F4-B277-2B3B5C4610E3';

export const Bots: Record<string, Bot> = {
  Bot1: {
    id: 'gpt_bot',
    name: 'GPT Bot',
    icon: require('./assets/bot.png'),
  },
  Bot2: {
    id: 'gpt_bot2',
    name: 'Witty Bot',
    icon: require('./assets/bot.png'),
  },
  Bot3: {
    id: 'gpt_bot3',
    name: 'Knowledge Bot',
    icon: require('./assets/bot.png'),
  },
};

export interface Bot {
  id: string;
  name: string;
  icon: any;
}
