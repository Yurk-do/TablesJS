interface MenuChildrenConfig {
  name: string;
  completed: boolean;
}

interface MenuConfig {
  name: string;
  completed: boolean;
  children?: MenuChildrenConfig[];
}

export const menuConfigMock: MenuConfig = {
  name: 'Select all',
  completed: false,
  children: [],
};
