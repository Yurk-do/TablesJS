import { TableComponent } from "../components/TableComponent";
import { CHAPTERS } from "../mocks/chapters";
import _, {isNil} from "lodash";
import { HIDDEN_CATEGORIES } from "../mocks/hidden-categories";
import { Chapter } from "../components/Chapter";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {IChapterInfo, ScrollConfig} from "../types/table";
import { IChapter, IDataForVizual } from "../types/chapter";
import { chaptersList } from "../mocks/chapter-mocks";
import styled from "@emotion/styled";
import { jspreadsheet } from "@jspreadsheet/react";
import openArrows from 'assets/open-arrows.svg';
import closeArrow from 'assets/close-arrows.svg';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  Modal,
  Tab,
  Tabs,
  Toolbar,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import { NavigationDrawer } from "../components/NavigationDrawer/NavigationDrawer";
import { useLayout } from "../components/NavigationDrawer/useLayout";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { OrderComponent } from "../components/OrderComponent";
import { VersionComponent } from "../components/VersionComponent";

const headerHeight=  48;

type DrawerContentType = 'versions-history' | 'client-orders';

type VisibilityConfig = {
  visibleRowsIds: number[];
  visibleChapters: string[];
  visibleCategories: string[];
};

type OrderType = {
  id: number;
  name: string;
  date: string;
  cost: string;
  modified: string;
  visibilityConfig: VisibilityConfig,
};

const StyledHomePage = styled.div`
`;

const StyledAppBar = styled(AppBar)`
  background-color: #DEECF9;
  color: black;
`;

const StyledHeaderToolbar = styled(Toolbar)`
    &.MuiToolbar-root {
      min-height: ${headerHeight}px;
    }
`;

const StyledTabs = styled(Tabs)`
  background-color: #DEECF9;
  color: black;
`;

const StyledLogo = styled.div`
`;

const StyledDrawer = styled(Drawer)`
  & > .MuiDrawer-paperAnchorDockedRight {
    border: none;
    top: ${headerHeight}px;
  }
`;

const StyledTablesContainer = styled.div<{ width: string }>`
  margin: ${headerHeight}px 0 0 0;
  width: ${({ width }) => width};
`;


const StyledRightPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  
  & > h2 {
    margin: 0;
  }
`;

const StyledIconWrapper = styled.span`
  cursor: pointer;
`;

const StyledToolbar = styled.div`
  display: flex;
  justify-content: space-between;  
  padding: 10px;
  align-items: center;
`;


const StyledModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledModalTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const StyledChaptersContainer = styled.div<{drawerOpen: boolean}>`
  max-height: calc(100vh - 282px);
 
    scrollbar-color: #9d9d9d transparent;
    scrollbar-width: auto;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        margin-top: 5px;
        width: 6px;
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar:horizontal {
        height: 7px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #9d9d9d;
        border: transparent;
        border-radius: 20px;
    }

    &:hover {
        scrollbar-color: #9d9d9d transparent;
        scrollbar-width: auto;
    }
`;

const StyledCommonCounter = styled.div`
  display: flex;
  color: black;
    line-height: 24px;
    padding: 6px 8px;
  
  & > p {
    margin: 0;
  }
`;

const StyledModalContent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background-color: white;
    border: 2px solid #000;
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 20px
`

export const HomePage = () => {
    const hiddenCategories = _.cloneDeep(HIDDEN_CATEGORIES);
    const chapterList: IChapter[] = _.cloneDeep(chaptersList);
    const chapters: IChapterInfo[] = _.cloneDeep(CHAPTERS);

    const [activeFullScreenChapter, setActiveFullScreenChapter] = useState<IChapterInfo  | null>(null);
    const chaptersContainer = useRef<HTMLDivElement | null>(null);

    const [isFullScreenMode, setIsFullScreenMode] = useState(false);

  const createDataForVizual = (): IDataForVizual => {
    const result = chapterList.reduce<Record<string, any>>((result, chapter) => {
      result[chapter.name] = {
        name: chapter.name,
        color: chapter.indicatorColor,
        completed: chapter.completed,
        categories: {},
        total: 0,
        initOpen: chapter.initOpen,
      };
      return result;
    }, {});

    chapters.forEach((chapter) => {
      let total = 0;
      result[chapter.name].categories = chapter.categories.reduce<Record<string, any>>(
        (obj, category) => {
          const isCategoryCompleted = !hiddenCategories.includes(
            category.name
          );
          obj[category.name] = {
            name: category.name,
            completed: isCategoryCompleted,
          };
          total =
            total +
            +category.data
              .reduce((acc, row) => {
                const totalLeft = Math.round(
                  (row.nationalMQ * row.nationalTD * row.price +
                    row.nationalOT) *
                  1.25
                );
                const totalRight = Math.round(
                  (row.internationalMQ *
                    row.internationalTD *
                    row.internationalRate +
                    row.internationalOT) *
                  1.25
                );
                return acc + Math.round(totalLeft + totalRight);
              }, 0)
              .toFixed(2);
          return obj;
        },
        {}
      );
      result[chapter.name].total = total;
    });
    return result;
  };

  const [dataForVizual, setDataForVizual] = useState(() => createDataForVizual());
  const [visibilityConfig, setVisibilityConfig] = useState<VisibilityConfig | null>(null);

  const { drawerWidth, openedDrawer, openDrawer, closeDrawer } = useLayout();
  const [ drawerContentType, setDrawerContentType ] = useState<DrawerContentType | null>(null);

  const closeRightPanel = () => {
    setDrawerContentType(null);
    setVisibilityConfig(null);
    closeDrawer();
  };

  const toggleRightPanel = (contentType: DrawerContentType) => {
    if (drawerContentType && contentType === drawerContentType) {
      closeRightPanel();
    } else {
      setDrawerContentType(contentType);
      openDrawer();
    }
  };

    const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // const changeChapterInitOpen = (chapter: IChapterConf) => {
  //   setDataForVizual({
  //     ...dataForVizual,
  //     [chapter.name]: {
  //       ...dataForVizual[chapter.name],
  //       initOpen: false,
  //     },
  //   });
  // };

    const changeFullScreenMode = (chapter: IChapterInfo | null) => {
      const chapterData = chapter ? dataForVizual[chapter.name] : null;
        setIsFullScreenMode(!!chapter);
        setActiveFullScreenChapter(chapter);
        // screenModeService.changeScreenMode(this.isFullScreenMode, chapterData);
    }

    const commonCounter = useMemo(
        () => {
          const total = Object.values(dataForVizual).reduce((result, item) => result + item.total,0);
          return Number(isNil(total) ? 0 : total).toLocaleString('de-DE');
        },
        [dataForVizual]
    );

    const updateChapterTotal = (chapterName: string, total: number)=> {
        setDataForVizual((prevData) => ({
            ...prevData,
            [chapterName]: {
                ...prevData[chapterName],
                'total': total,
            },
        }));
    };

    const checkNeedScrolling = (element: Element): ScrollConfig => {
        const elementBCR = element.getBoundingClientRect();
        const containerBCR =
            chaptersContainer.current?.getBoundingClientRect() as DOMRect;

        return {
            needBottom: elementBCR.bottom - containerBCR.bottom,
            needTop: containerBCR.top - elementBCR.top,
            needRight: elementBCR.right - containerBCR.right,
            needLeft: containerBCR.left - elementBCR.left,
        };
    }

    const selectCell = (activeCell: any, worksheet: jspreadsheet.worksheetInstance) => {
        const { needBottom, needTop, needRight, needLeft } =
            checkNeedScrolling(activeCell);
        const chapterContainer = worksheet.table.closest('.tables-container');

        if (needTop > 0) {
        chaptersContainer.current?.scrollBy(0, -needTop);
    } else if (needBottom > 0) {
        chaptersContainer.current?.scrollBy(0, needBottom);
    }
    if (needRight > 0) {
        chapterContainer?.scrollBy(needRight, 0);
    } else if (needLeft > 0) {
        chapterContainer?.scrollBy(-needLeft, 0);
    }
};


const chaptersArray = useMemo(() => {
  return CHAPTERS.map((chapter) => (
    <Chapter
      hide={!!(activeFullScreenChapter && activeFullScreenChapter?.name !== chapter.name) || (!!visibilityConfig && !visibilityConfig?.visibleChapters.includes(chapter.name))}
      key={chapter.name}
      chapter={dataForVizual[chapter.name]}
      isFullScreenMode={activeFullScreenChapter?.name === chapter.name}
      actions={
        <div className="chapter-action-panel">
          {!isFullScreenMode ? (
            <img
              onClick={() => changeFullScreenMode(chapter)}
              src={openArrows}
              alt=""
              style={{cursor: 'pointer'}}
            />
          ) : (
            <img
              onClick={() => changeFullScreenMode(null)}
              src={closeArrow}
              style={{cursor: 'pointer'}}
              alt=""
            />
          )}
          <div className="category-menu">
          </div>
        </div>
      }
      details={
        <div className="tables-container">
          <TableComponent
            key={chapter.name}
            visibleCategories={visibilityConfig?.visibleCategories || null}
            visibleRowsIds={visibilityConfig?.visibleRowsIds || null}
            categories={chapter.categories}
            editable={true}
            isShowFormulas={true}
            isShowZeroValues={true}
            updateChapterTotal={(total) => updateChapterTotal(chapter.name, total)}
            selectCell={selectCell}
          />
        </div>
      }
    />
  )
)}, [activeFullScreenChapter, isFullScreenMode, dataForVizual, visibilityConfig?.visibleChapters]
  );

  const versions = [
    {id: 1, type: 'Current Version', date: new Date().toDateString(), modified: 'Ralph Edwards'},
    {id: 2, type: 'Before restoring Version 2', date: new Date().toDateString(), modified: 'Kristian Watson'},
    {id: 3, type: 'Print cover letter', date: new Date().toDateString(), modified: 'Ralph Edwards'},
    {id: 4, type: 'Sent for approval', date: new Date().toDateString(), modified: 'Kristian Watson'},
    {id: 5, type: 'Current Version', date: new Date().toDateString(), modified: 'Ralph Edwards'},
    {id: 6, type: 'Before restoring Version 2', date: new Date().toDateString(), modified: 'Kristian Watson'},
    {id: 7, type: 'Print cover letter', date: new Date().toDateString(), modified: 'Ralph Edwards'},
    {id: 8, type: 'Sent for approval', date: new Date().toDateString(), modified: 'Kristian Watson'},
    {id: 9, type: 'Current Version', date: new Date().toDateString(), modified: 'Ralph Edwards'},
    {id: 10, type: 'Before restoring Version 2', date: new Date().toDateString(), modified: 'Kristian Watson'},
    {id: 11, type: 'Print cover letter', date: new Date().toDateString(), modified: 'Ralph Edwards'},
    {id: 12, type: 'Sent for approval', date: new Date().toDateString(), modified: 'Kristian Watson'},
  ];

  const orders: OrderType[] = [
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
      }},
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
        visibleCategories: ['CAMERA EQUIPMENT', 'LIGHTNING', 'PRINCIPALS', 'CREW'],
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
        visibleRowsIds: [2102, 2103, 2104, 4104, 4105, 4106, 4307, 4308, 4309, 5201, 5202, 5203],
        visibleCategories: ['CAMERA EQUIPMENT', 'LIGHTNING', 'PRINCIPALS', 'PROPS + MATERIALS'],
        visibleChapters: ['Cast', 'Equipment', 'Art Department'],
      },
    }
  ];

  const selectOrder = (order: OrderType) => {
      setVisibilityConfig(order.visibilityConfig);
  };

  const drawerContent = useMemo(
    () => <Box role="presentation" style={{ width: '300px', marginTop: '50px' }}>
      <StyledRightPanelHeader>
        {drawerContentType && <h2>{drawerContentType === 'versions-history' ? 'Version history' : 'Client orders'}</h2>}
        <StyledIconWrapper>
          <CloseIcon onClick={closeRightPanel} sx={{ cursor: 'pointer' }}/>
        </StyledIconWrapper>
      </StyledRightPanelHeader>
      <Box display="flex" flexDirection="column" gap="12px">
        {
          drawerContentType === 'versions-history'
            ? versions.map((version) => (<VersionComponent id={version.id} date={version.date} key={version.id}/>))
            : orders.map((order) => (<OrderComponent key={order.id} name={order.name} date={order.date} cost={order.cost } onSelectOrder={() => selectOrder(order)}/>))
        }
      </Box>
    </Box>, [drawerContentType]
  );

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tableWidth = useMemo(() => openedDrawer ? `${document.body.clientWidth - drawerWidth}px` : '100%', [drawerWidth, openedDrawer])

  return (
    <StyledHomePage>
      <StyledAppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
        <StyledHeaderToolbar>
          <StyledLogo>
            SCoPE X
          </StyledLogo>
          <StyledTabs value={value} onChange={handleChange} centered>
              <Tab label="Key Parameters" />
              <Tab label="Summary" />
              <Tab label="Calculations" />
              <Tab label="Cover Letter" />
            </StyledTabs>
          <StyledIconWrapper>
            <HistoryIcon onClick={() => toggleRightPanel('versions-history')} color={openedDrawer && drawerContentType === 'versions-history' ? 'secondary' : 'primary'}/>
          </StyledIconWrapper>
          <StyledIconWrapper>
            <AccountBalanceWalletIcon onClick={() => toggleRightPanel('client-orders')} color={openedDrawer && drawerContentType === 'client-orders' ? 'secondary' : 'primary'}/>
          </StyledIconWrapper>
          </StyledHeaderToolbar>
        </StyledAppBar>
        <StyledTablesContainer width={tableWidth}>
          {!isFullScreenMode && <StyledToolbar>
              <StyledCommonCounter>
                  <p>TOTAL:</p>
                  <p>{commonCounter}</p>
              </StyledCommonCounter>
            {!openedDrawer && <Button variant="contained" color="primary" onClick={openModal} sx={{ cursor: 'pointer' }}>Create Project</Button>}
          </StyledToolbar>}
          <StyledChaptersContainer ref={chaptersContainer} drawerOpen={openedDrawer}>
            {chaptersArray}
          </StyledChaptersContainer>
          <NavigationDrawer
            navigationDrawerContent={drawerContent}
            resizable
          />
        </StyledTablesContainer>
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledModalContent>
          <StyledModalHeader>
            <StyledModalTitle>
              Create Project
            </StyledModalTitle>
            <StyledIconWrapper>
              <CloseIcon onClick={closeModal}></CloseIcon>
            </StyledIconWrapper>
          </StyledModalHeader>
          <Box display="flex" flexDirection="column">
          </Box>
        </StyledModalContent>
      </Modal>
      </StyledHomePage>
    )
        ;
};