export type VisibilityConfig = {
  visibleRowsIds: number[];
  visibleChapters: string[];
  visibleCategories: string[];
};

export type OrderType = {
  id: number;
  name: string;
  date: string;
  cost: string;
  modified: string;
  visibilityConfig: VisibilityConfig;
};

export const orders: OrderType[] = [
  {
    id: 1,
    name: 'Shooting in Chicago',
    date: '09.04.2024',
    cost: '€ 1.858.234',
    modified: 'Ralph Edwards',
    visibilityConfig: {
      visibleRowsIds: [2102, 2103, 2105, 1301, 1302, 3405, 3406, 3407],
      visibleCategories: ['CAMERA CREW', 'PPM | TRAVELCOST', 'PRINCIPALS'],
      visibleChapters: ['Pre-production', 'Salaries', 'Cast'],
    },
  },
  {
    id: 2,
    name: 'Shooting in Milan',
    date: '02.03.2024',
    cost: '€ 2.000.000',
    modified: 'Ralph Edwards',
    visibilityConfig: {
      visibleRowsIds: [2101, 2105, 4107, 4108, 4111, 4112],
      visibleCategories: ['CAMERA EQUIPMENT', 'LIGHTNING', 'PRINCIPALS'],
      visibleChapters: ['Cast', 'Equipment'],
    },
  },
  {
    id: 3,
    name: 'Shooting in New York',
    date: '02.05.2024',
    cost: '€ 2.350.000',
    modified: 'Ralph Edwards',
    visibilityConfig: {
      visibleRowsIds: [2101, 2105, 2106, 4114, 4115, 4305, 4306, 5104, 5105],
      visibleCategories: [
        'CAMERA EQUIPMENT',
        'LIGHTNING',
        'PRINCIPALS',
        'CREW',
      ],
      visibleChapters: ['Cast', 'Equipment', 'Art Department'],
    },
  },
  {
    id: 4,
    name: 'Shooting in Paris',
    date: '01.02.2024',
    cost: '€ 2.250.000',
    modified: 'Ralph Edwards',
    visibilityConfig: {
      visibleRowsIds: [
        2102, 2103, 2104, 4104, 4105, 4106, 4307, 4308, 4309, 5201, 5202, 5203,
      ],
      visibleCategories: [
        'CAMERA EQUIPMENT',
        'LIGHTNING',
        'PRINCIPALS',
        'PROPS + MATERIALS',
      ],
      visibleChapters: ['Cast', 'Equipment', 'Art Department'],
    },
  },
];
