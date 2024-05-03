interface ICategoryConf {
    name: string;
    completed: boolean;
    visibleRows?: string[];
    hidden?: boolean;
}

export interface ICategoryDataForVizual {
    [key: string]: ICategoryConf;
}

export interface IChapterConf {
    name: string;
    completed: boolean;
    categories: ICategoryDataForVizual;
    color: string;
    total: number;
    initOpen: boolean;
    hidden?: boolean;
}

export interface IDataForVizual {
    [key: string]: IChapterConf;
}

export interface IChapter {
    id: number;
    name: string;
    completed: boolean;
    indicatorColor: string;
    initOpen: boolean;
}
