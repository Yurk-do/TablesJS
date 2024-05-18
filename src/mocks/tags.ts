export type TagType = {
  name: string;
  color: string;
};

export const tagNamesInitial: Record<string, string> = {
  'tag1': 'tag1',
  'tag2': 'tag2',
  'tag3': 'tag3',
  'tag4': 'tag4',
  'tag5': 'tag5',
  'tag6': 'tag6',
};

export const tags: TagType[] = [
  {
    name: 'tag1',
    color: 'red'
  },
  {
    name: 'tag2',
    color: 'blue'
  },{
    name: 'tag3',
    color: 'yellow'
  },{
    name: 'tag4',
    color: 'green'
  },{
    name: 'tag5',
    color: 'orange'
  },{
    name: 'tag6',
    color: 'black'
  },
];
