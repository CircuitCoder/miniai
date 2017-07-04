export default {
  defaultToken: 'invalid',

  keywords: [
    'WALK',
    'TURN',
    'ATTACK',
    'IF',
    'END',
    'LOOP',
  ],

  operators: [
    'NOT',
    'FACING',
  ],

  directions: [
    'left', 'right'
  ],

  blocks: [
    'air', 'wall', 'exit', 'dragon',
  ],

  tokenizer: {
    root: [
      [/[A-Z_$][\w$]*/, {
        cases: {
          '@keywords': 'keyword',
          '@operators': 'annotation',
          '@default': '' 
        }
      }],

      [/[a-z_$][\w$]*/, {
        cases: {
          '@directions': 'string',
          '@blocks': 'string',
          '@default': ''
        }
      }],

      [/\d+/, 'number'],
    ],
  },
};

