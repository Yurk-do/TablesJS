import { TableComponent } from "../components/TableComponent";
import { CHAPTERS } from "../mocks/chapters";
import _, {isNil} from "lodash";
import { HIDDEN_CATEGORIES } from "../mocks/hidden-categories";
import { Chapter } from "../components/Chapter";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {CellCoords, IChapterInfo, ScrollConfig} from "../types/table";
import { IChapter, IDataForVizual } from "../types/chapter";
import { chaptersList } from "../mocks/chapter-mocks";
import { jspreadsheet } from "@jspreadsheet/react";
import openArrows from 'assets/open-arrows.svg';
import closeArrow from 'assets/close-arrows.svg';
import {
  Box,
  Button,
  FormControlLabel, Input,
  Modal,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import { NavigationDrawer } from "../components/NavigationDrawer/NavigationDrawer";
import { useLayout } from "../components/NavigationDrawer/useLayout";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { OrderComponent } from "../components/OrderComponent";
import { VersionComponent } from "../components/VersionComponent";
import { versions } from "../mocks/versions";
import { orders, OrderType, VisibilityConfig } from "../mocks/orders";
import {
  StyledAppBar,
  StyledChaptersContainer, StyledContentHeaderWrapper,
  StyledHomePage,
  StyledIconWrapper,
  StyledModalContent,
  StyledModalHeader,
  StyledModalTitle,
  StyledRightPanelHeader,
  StyledTablesContainer
} from "./StyledHomePage";
import { TablesContainerHeader } from "../components/TablesContainerHeader";
import { MainHeader } from "../components/MainHeader";
import {ContentHeader} from "../components/ContentHeader";
import styled from "@emotion/styled";
import {getCellName} from "../helpers/helpers";
import {JModal} from "../components/JModal";

const StyledFormulaInput = styled(Input)`
  min-width: 320px;
  margin-left: 10px;
    text-align: start;
    
  &.input {
      box-sizing: border-box;
      background-color: #fff;
      font-size: 1em;
      line-height: initial;
      border-radius: 2px;
  }  
`;

type DrawerContentType = 'versions-history' | 'client-orders';

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

  const [ showFormulas, setShowFormulas ] = useState(false);

  const formulasVisibilityHandler = () => setShowFormulas(!showFormulas);

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

    const [formula, setFormula] = useState<string>('');
    const [activeTableName, setActiveTableName] = useState<string>('');
    const [activeCellName, setActiveCellName] = useState<string>('');

    const selectCell = (coords: { x: number, y: number }, worksheet: jspreadsheet.worksheetInstance, tableName: string) => {
      const activeCell = worksheet.getCell(coords.x, coords.y) as HTMLElement;

      const cellName = getCellName(coords);

      const data = worksheet.getValue(cellName, false);

      const formula = data.length && data.startsWith('=') ? data : '';

      setActiveTableName(tableName);

      setActiveCellName(cellName)
      setFormula(formula);

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

const [isJModalOpen, setIsJModalOpen] = useState(false);

const [invoiceData, setInvoiceData] = useState<any | null>(null);
const [cellCoords, setCellCoords] = useState<CellCoords | null>(null);

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
            setCellCoords={setCellCoords}
            key={chapter.name}
            setRowData={setInvoiceData}
            openJModal={() => setIsJModalOpen(true)}
            visibleCategories={visibilityConfig?.visibleCategories || null}
            visibleRowsIds={visibilityConfig?.visibleRowsIds || null}
            categories={chapter.categories}
            editable={true}
            isShowFormulas={showFormulas}
            isShowZeroValues={true}
            updateChapterTotal={(total) => updateChapterTotal(chapter.name, total)}
            selectCell={selectCell}
          />
        </div>
      }
    />
  )
)}, [activeFullScreenChapter, isFullScreenMode, showFormulas, dataForVizual, visibilityConfig?.visibleChapters]
  );

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

  const tableWidth = useMemo(() => openedDrawer ? `${document.body.clientWidth - drawerWidth}px` : '100%', [drawerWidth, openedDrawer]);

  const [undoDisable, setUndoDisable] = useState(true);

  useEffect(() => {
    const index = jspreadsheet.history.actions.findIndex((item: { action: string }) => item.action !== 'deleteWorksheet');
    setUndoDisable(index === -1 || jspreadsheet.history.index < index);
  }, [jspreadsheet.history.index]);


  const changeFormula = (e: any) => {
    // @ts-ignore
    const activeWorksheet: jspreadsheet.worksheetInstance = (jspreadsheet.spreadsheet as jspreadsheet.spreadsheetInstance[]).find(s => s.name === activeTableName).worksheets[0];

    const value = e.target.value;

    activeWorksheet.setValue(activeCellName, value, true);
    setFormula(value);
  };

  const closeJModal = (e: object, reason: string) => {
    reason !== 'backdropClick' && setIsJModalOpen(false);
  }

  return (
    <StyledHomePage>
      <StyledAppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
        <MainHeader
          icons={
            <>
              <StyledIconWrapper>
                <HistoryIcon
                  onClick={() => toggleRightPanel('versions-history')}
                  color={openedDrawer && drawerContentType === 'versions-history' ? 'secondary' : 'primary'}
                />
              </StyledIconWrapper>
              <StyledIconWrapper>
                <AccountBalanceWalletIcon
                  onClick={() => toggleRightPanel('client-orders')}
                  color={openedDrawer && drawerContentType === 'client-orders' ? 'secondary' : 'primary'}
                />
              </StyledIconWrapper>
            </>
          }
        />
        </StyledAppBar>
      <StyledContentHeaderWrapper>
        <ContentHeader
          showFormulas={showFormulas}
          formulasVisibilityHandler={formulasVisibilityHandler}
        />
      </StyledContentHeaderWrapper>
      <Box display="flex" justifyContent="start" marginTop="10px">
        <FormControlLabel
          labelPlacement="start"
          label="Fx"
          control={
            <StyledFormulaInput value={formula} onChange={changeFormula}/>
          }
        />
      </Box>
      <StyledTablesContainer width={tableWidth}>
        {!isFullScreenMode && (
          <TablesContainerHeader
            undoDisable={undoDisable}
            counter={commonCounter}
            rightPart={!openedDrawer && (
              <Button variant="contained" color="primary" onClick={openModal} sx={{ cursor: 'pointer' }}>
                Create Project
              </Button>
            )}
          />
        )}
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
      {isJModalOpen && <JModal data={invoiceData} onClose={closeJModal} startCoords={cellCoords || undefined}/>}
      </StyledHomePage>
    )
  ;
};