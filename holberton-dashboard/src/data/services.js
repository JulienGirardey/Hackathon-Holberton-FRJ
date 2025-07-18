// Services par défaut pour les étudiants Holberton
export const defaultServices = [
  {
    id: 'intra',
    name: 'Holberton Intra',
    description: 'Accéder à vos projets et evaluations',
    url: 'https://intranet.hbtn.io/',
    icon: '🎓',
    category: 'education',
    color: 'bg-red-500'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Gérer vos repositories',
    url: 'https://github.com/',
    icon: '💻',
    category: 'development',
    color: 'bg-gray-800'
  },
  {
    id: 'slack',
    name: 'Slack Holberton',
    description: 'Communiquer avec votre cohort',
    url: 'https://holbertonschool.slack.com/',
    icon: '💬',
    category: 'communication',
    color: 'bg-purple-500'
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Organiser vos notes et projets',
    url: 'https://notion.so/',
    icon: '📝',
    category: 'productivity',
    color: 'bg-blue-500'
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Chat vocal et communauté',
    url: 'https://discord.com/',
    icon: '🎮',
    category: 'communication',
    color: 'bg-indigo-500'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Learning',
    description: 'Formations complémentaires',
    url: 'https://linkedin.com/learning/',
    icon: '🏆',
    category: 'education',
    color: 'bg-blue-600'
  }
];

export const categories = [
  { id: 'education', name: 'Éducation', icon: '🎓' },
  { id: 'development', name: 'Développement', icon: '💻' },
  { id: 'communication', name: 'Communication', icon: '💬' },
  { id: 'productivity', name: 'Productivité', icon: '📝' }
];
