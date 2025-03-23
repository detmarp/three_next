export function makeDeck() {
  return {
    cottage: {
      category: 'blue',
      name: 'Cottage',
      shape: [
        '-y',
        'rc'
      ],
      score: {
        value: 3,
        condition: 'fed'
      },
      text: '3{coin} if this building is fed.',
    },
    theater: {
      category: 'yellow',
      name: 'Theater',
      shape: [
        '-g-',
        'bcb'
      ],
      score: {
        value: 1,
        condition: 'unique-row-column'
      },
      text: '1{coin} for each other unique building type in the same row and column as {yellow}.',
    },
    tavern: {
      category: 'green',
      name: 'Tavern',
      shape: [
        'rrc',
      ],
      score: {
        lookup: 'tavern'
      },
      text: '{coin} based on your constructed {green}.',
    },
    chapel: {
      category: 'orange',
      name: 'Chapel',
      shape: [
        '--c',
        'gcg'
      ],
      score: {
        value: 1,
        condition: 'fed-blue'
      },
      text: '1{coin} for each fed {blue}.',
    },
    factory: {
      category: 'black',
      name: 'Factory',
      shape: [
        'b---',
        'rggr',
      ],
      score: {
        value: 0,
      },
      text: 'When constructed, place 1 of the 5 resources on {black}. When another player names this resource, you may place a different resource instead.'
    },
    farm: {
      category: 'red',
      name: 'Farm',
      shape: [
        'yy',
        'bb',
      ],
      text: 'Feeds 4 {crop} buildings anywhere in your town.',
    },
    well: {
      category: 'gray',
      name: 'Well',
      shape: [
        'bg',
      ],
      score: {
        value: 1,
        condition: 'adjacent-blue'
      },
      text: '1{coin} for each adjacent {blue}.',
    },
    guild: {
      name: "Architect's Guild",
      category: 'pink',
      shape: [
        '--c',
        '-yg',
        'br-'
      ],
      max: 1,
      score: {
        value: 1
      },
      built: {
        action: 'replace',
        max: 2
      },
      text: '1{coin}. When constructed, replace up to 2 buildings in your town with any other building.'
    }
  };
}