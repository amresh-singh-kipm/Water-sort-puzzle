// FUNCTION TO FIND ADJACENT COLOR
export const isAdjacentSame = (source, target) => {
  if (source[0] === source[1]) {
    if (source[1] === source[2]) {
      if (target.length > 0) {
        // RETURNING COLOR AS REQUIRED TO FILL CONTAINER
        return 4 - target.length;
      }
      // RETURNING ALL COLOR IF CONTAINER IS EMPTY
      return 3;
    } else {
      if (target.length > 0) {
        if (target.length == 1) {
          return 2;
        } else {
          return 4 - target.length;
        }
      }
      return 2;
    }
  }
  return 1;
};

// FUNCTION TO CHECK IS CONTAINER COMPLETED
export const isContainerCompleted = container => {
  return (
    container.color.length === 4 &&
    container.color.every(color => color === container.color[0])
  );
};

// FUNCTION TO CHECK IS LEVEL COMPLETED
export const isLevelCompleted = level => {
  return level.every(cont => (cont.color.length > 0 ? cont.isCompleted : true));
};

// GENERATING NEXT LEVEL
export const generateLevelData = (level, colors) => {
  const totalColors = Math.min(4 + level, colors.length); // Use a maximum of available colors
  // const totalColors = Math.min(2); // Use a maximum of available colors
  const totalContainers = totalColors + 2; // Add 2 empty containers
  // const totalContainers = totalColors + 2; // Add 2 empty containers
  const maxCapacity = 4; // Each container can hold 4 colors
  const colorPool = [];

  // Fill the color pool with repeated color codes
  for (let i = 0; i < totalColors; i++) {
    colorPool.push(...Array(maxCapacity).fill(colors[i]));
  }

  // Shuffle the colors
  const shuffledColors = colorPool.sort(() => Math.random() - 0.5);

  // Distribute shuffled colors into containers
  const contain = Array.from({length: totalContainers}, () => ({
    isCompleted: false,
    color: [],
  }));

  shuffledColors.forEach(color => {
    let added = false;
    while (!added) {
      const randomIndex = Math.floor(Math.random() * (totalContainers - 2));
      if (contain[randomIndex].color.length < maxCapacity) {
        contain[randomIndex].color.push(color);
        added = true;
      }
    }
  });
  return contain;
};

export function retrunCenter(pageX, pageY) {
  if (pageX > 30 && pageX < 95) {
    return 3;
  }
  if (pageX > 113 && pageX < 156) {
    return Math.floor((113 + 156) / 2) - 210;
  }
  if (pageX > 180 && pageX < 231) {
    return Math.floor((185 + 245) / 2) - 210;
  }
  if (pageX > 251 && pageX < 301) {
    return Math.floor((249 + 298) / 2) - 210;
  }
  if (pageX > 323 && pageX < 368) {
    return Math.floor((323 + 368) / 2) - 210;
  }
  if (pageX > 113 && pageX < 156) {
    return Math.floor((113 + 156) / 2);
  }
}

// Keywords for showing ads
export const arr = [
  'zepto',
  'zepto +',
  'blinkit',
  'ola',
  'uber',
  'rapido',
  'amazon web services',
  'rummy ola',
  'ixbet',
  'parimatch bet',
  'sports gambling',
  'zomato',
  'swiggy',
  'myntra',
  'amazon',
  'filpcart',
  'how to earn money',
  'how to earn money online',

  'dinosaur game',
  'online sales training',
  'universal technical institute',
  'project management training online',
  '365bet',
  'gta 6',
  'subway surfers',
  'gta 5 mobile',
  'computer courses near me',
  'allsport365',
  'valorant',
  'ghost of tsushima',
  'yandex games',
  'online gambling',
  'pokemon cards',
  'splendor',
  'best gambling sites',
  'puzzle games',
  'online marketing courses',
  'uncharted',
  'playstation 5',
  'grand theft auto v',
  'temple run 2',
  'stake betting',
  'play bet',
  'drivers ed near me',
  'becric',
  'coursera continue learning',
  'bet co',
  'bseh org in',
  'google tic tac toe',
  'pokemon',
  'typing games',
  'bubble shooter',
  'mca distance education',
  'ztype',
  'google pac man',
  'minecraft free',
  'learn digital marketing online',
  'mobile legends',
  'indiabulls housing finance',
  'ssapunjab',
  '24betting',
  'krunker',
  'free games',
  'steam',
  'online gambling sites',
  'gambling sites',
  'play station',
  'online games',
  'spades',
  'carrom',
  'gambling websites',
  'business courses online',
  'best betting sites',
  'sudoku',
  'women education',
  'zerg rush',
  'pokemon showdown',
  'minecraft games',
  'digital marketing course online',
  'best betting',
  'total battle',
  'ludo game',
  'stumble guys',
  'khelo24bet',
  'ignou admission',
  'ix bet',
  'mpl pro',
  'chess game',
  'driving schools',
  'free games to play',
  'mad max',
  'smash',
  'minecraft',
  'atari breakout',
  'pokerstars sports',
  'gseb org',
  'fall guys',
  '1x bet',
  'video game',
  'games',
  'ninja',
  'puzzle',
  'dice',
  'fallout',
  'weight lifting weights',
  'online business schools',
  'business administration courses online',
  'acca online courses',
  'fitness clubs near me',
  'google pacman',
  'temple run',
  'scert',
  'inspire scholarship',
  'indira gandhi open university',
  'google doodle games',
  'forza horizon 5',
  'ps5 price',
  'dafabet sports',
  'karresults nic in',
  'active and fit',
  'steamunlocked',
  'indibet',
  'snake',
  'solitaire games',
  'rummy',
  'hitman',
  'ps4',
  'tic tac toe',
  'british school',
  'sudoku online',
  'top betting sites',
  'directorate of education',
  'courses on digital marketing',
  'learn digital marketing',
  'google feud',
  'education',
  'gaming',
  'spider solitaire',
  'freecell',
  'polytechnic',
  'betting exchange',
  'car games',
  'management courses online',
  'gta v',
  'candy crush',
  'leadership and management courses online',
  'the last of us',
  'ux courses online',
  'best online digital marketing courses',
  '10cric',
  '4rabet com',
  'rte admission',
  'wbscte',
  'resident evil',
  'final fantasy',
  'mortal kombat',
  'chess online',
  'teachers day',
  'cpa online learning',
  'online pg courses',
  'best project management courses',
  'riotgames',
  'devops course online',
  'any fitness',
  'bba distance education',
  'ufc betting',
  'edudel in nic',
  'nmms scholarship',
  'bseb 12th result',
  'games to play',
  'crosswords',
  'drivers ed',
  'pac man',
  'google games',
  'gaming pc',
  'best sports betting sites',
  'teachers day',
  'business analyst course online',
  'bet way',
  'the witcher',
  'taptap',
  'clash of clans',
  'devops online training',
  'goals fitness',
  'bseodisha',
  'linebet',
  'x box',
  'online chess game',
  'typeracer',
  'paperio',
  'udemy business courses',
  'mostbet',
  'ui ux online course',
  '4rabet',
  'dafasports',
  'teacher',
  'joystick',
  'chess',
  'gta',
  'snake game',
  'gta vice city',
  'project management courses online',
  'carrom board',
  'syllabi',
  'sudoku puzzles',
  'hero wars',
  'bseb',
  'aws online training',
  'hdfc bank ltd stock',
  'rbse result',
  'sbtet attendance',
  'ui ux design course online',
  'garena free fire',
  'pubg mobile lite',
  'bet in exchange',
  'betting',
  'pc',
  'sims',
  'lol',
  'best online gambling sites',
  'bet 360',
  'hr courses online',
  'ps5',
  'leadership courses online',
  'd ed',
  'pmp course online',
  'driving school near me',
  'poki game',
  'cbse class 10 result',
  'www schooleducation kar nic in',
  'bieap',
  'bgmi',
  'fortnite',
  'gseb result',
  'pubg',
  'bseb 10th result',

  'colleges',
  'betting websites',
  'dragon ball z',
  'solitaire',
  'tekken 3',
  'bet us',
  'online leadership training',
  'best online betting sites',
  'cbse site',
  'ets org',
  'digital marketing course online with certificate',
  'khelo 24 bet',
  'smash karts',
  'black myth wukong',
  'rajshaladarpan nic in result',
  'edudel nic',
  'higher education',
  'online business classes',
  'gaming laptop',
  'online marketing classes',
  'gta 5',
  'assassin creed',
  'minecraft pocket edition',
  'selenium online training',
  'play school near me',
  'english speaking classes near me',
  'ludo king',
  'schooleducation kar nic in',
  'among us',
  'rummy circle',
  'play games',
  'uno',
  'rpg',
  'online bookmakers',
  'distance learning bachelor degree',
  'online business management courses',
  'psp games',
  'pmp online training',
  'gta5',
  'digital marketing training courses',
  'best online marketing courses',
  'flappy bird',
  'cloud courses online',
  'rummy glee',
  'most bet',
  'udise+',
  'hp victus',
  'live betting',
  'corporate fitness',
  'god of war',
  'education connection',
  'escape room',
  'azure online training',
  'epic games store',
  'pari bet',
  'cne online',
  'bajfinance',
  'control',
  'free online games',
  'business studies online',
  'minesweeper',
  'quality education',
  'human resources courses online',
  'gta san andreas',
  'asus tuf f15',
  'battlegrounds mobile india',
  'indira gandhi national open university',
  'mel bet',
  'x1bet',
  'pubg lite',
  'stp computer education',
  'khelo24',
  'invest in invoice discounting',
  'royally rummy',

  // Grocery and Quick Delivery
  'grocery delivery',
  'instant grocery',
  'online supermarkets',
  'food delivery apps',
  'quick delivery service',
  'same day delivery',
  'fresh vegetables online',
  'milk delivery apps',
  'Blinkit offers',
  'Zepto grocery',

  // Ride-Hailing and Transport
  'taxi service',
  'online cab booking',
  'Ola cabs',
  'Rapido bike taxi',
  'cheap rides',
  'safe transport options',
  'ride-sharing apps',
  'carpooling apps',
  'long-distance cabs',
  'online auto booking',

  // E-commerce and Daily Needs
  'online shopping',
  'instant delivery',
  'best deals online',
  'home essentials',
  'daily essentials delivery',
  'Amazon shopping',
  'Flipkart offers',
  'Swiggy Instamart',
  'urban convenience',
  'delivery discounts',

  // Lifestyle and Urban Living
  'fast urban life',
  'work-life balance',
  'online convenience',
  'apps for daily life',
  'digital services',
  'instant solutions',
  'express delivery apps',
  'mobility apps',
  'big brand discounts',
  'fast grocery apps',

  // Finance Keywords
  'credit cards',
  'personal loans',
  'mutual funds',
  'stock trading apps',
  'investment platforms',
  'crypto trading',
  'online banking',
  'wealth management',
  'insurance plans',
  'best savings accounts',

  // Technology Keywords
  'AI tools',
  'cloud computing',
  'best smartphones',
  'tech gadgets',
  'software development courses',
  'coding bootcamp',
  'blockchain technology',
  'cybersecurity',
  'top laptops',
  'machine learning',

  // Education Keywords
  'online courses',
  'learn Python',
  'MBA programs',
  'digital marketing courses',
  'IT certifications',
  'free coding classes',
  'distance learning',
  'IELTS preparation',
  'study abroad',
  'AI in education',

  // Health and Fitness Keywords
  'weight loss programs',
  'diet plans',
  'home workouts',
  'fitness apps',
  'mental health support',
  'yoga classes',
  'healthy recipes',
  'gym equipment',
  'nutrition tips',
  'personal training',

  // E-commerce Keywords
  'online shopping',
  'best deals',
  'discount coupons',
  'festive sales',
  'fashion brands',
  'gadgets on sale',
  'home appliances',
  'top clothing stores',
  'daily essentials online',
  'fast delivery services',

  // Gaming Keywords
  'strategy games',
  'multiplayer games',
  'top gaming laptops',
  'best gaming consoles',
  'mobile games',
  'esports',
  'PS5 games',
  'online tournaments',
  'battle royale',
  'game streaming platforms',

  // Entertainment and Lifestyle Keywords
  'OTT platforms',
  'top TV shows',
  'music streaming',
  'movie reviews',
  'celebrity news',
  'travel vlogs',
  'luxury lifestyles',
  'home decor',
  'fashion trends',
  'event tickets',

  // Travel Keywords
  'cheap flights',
  'hotel booking',
  'holiday packages',
  'luxury resorts',
  'travel tips',
  'best travel destinations',
  'weekend getaways',
  'car rentals',
  'adventure trips',
  'family vacations',

  // Business and Marketing Keywords
  'business coaching',
  'leadership training',
  'online marketing strategies',
  'startup tips',
  'entrepreneurship',
  'branding ideas',
  'social media marketing',
  'freelancing tips',
  'business loans',
  'ecommerce solutions',

  // Miscellaneous High-Paying Keywords
  'best insurance',
  'retirement plans',
  'real estate',
  'life coaching',
  'solar panels',
  'electric vehicles',
  'online subscriptions',
  'cloud storage',
  'top software tools',
  'legal advice online',

  'best online courses',
  'learn programming online',
  'top coding bootcamps',
  'fastest way to learn English',
  'top mobile games',
  'best gaming apps',
  'free movie streaming',
  'weight loss apps',
  'yoga for beginners',
  'home workout plans',
  'best protein supplements',
  'best taxi app',
  'cheapest ride-sharing',
  'bike rental near me',
  'fastest cab booking',
  'grocery delivery near me',
  'online shopping discounts',
  'fastest delivery app',
  'cheap food delivery',
  'same-day delivery',
  'best credit card offers',
  'stock market investing',
  'crypto trading',
  'insurance plans',
  'personal loans',
  'best VPN app',
  'cloud storage services',
  'AI chatbot',
  'productivity tools',
  'High-paying video ads',
  'Rewarded video ads',
  'Top paying ad networks',
  'Best eCPM video ads',
  'High engagement ads',
  'Meesho',
  'Paytm',
  'Google',
  'Pay',
  'CRED',
  'Shopping discounts',
  'Online gaming rewards',
  'Instant cashback offers',
  'Limited-time deals',
  'Entertainment streaming ads',
];
