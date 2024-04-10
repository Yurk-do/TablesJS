interface ICategoryConf {
    name: string;
    completed: boolean;
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
}

export interface IDataForVizual {
    [key: string]: IChapterConf;
}

export interface Chapter {
    id: number;
    name: string;
    completed: boolean;
    indicatorColor: string;
    initOpen: boolean;
}
