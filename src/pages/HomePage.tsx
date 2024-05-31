import _, { isNil } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { jspreadsheet } from '@jspreadsheet/react';
import openArrows from 'assets/open-arrows.svg';
import closeArrow from 'assets/close-arrows.svg';
import { Box, Button, FormControlLabel, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TagIcon from '@mui/icons-material/Tag';
import SaveIcon from '@mui/icons-material/Save';
import { TableComponent } from '../components/TableComponent';
import { HIDDEN_CATEGORIES } from '../mocks/hidden-categories';
import { Chapter } from '../components/Chapter';
import { CellCoords, IChapterInfo, ScrollConfig } from '../types/table';
import { IChapter, IDataForVizual } from '../types/chapter';
import { chaptersList } from '../mocks/chapter-mocks';
import { NavigationDrawer } from '../components/NavigationDrawer/NavigationDrawer';
import { useLayout } from '../components/NavigationDrawer/useLayout';
import { OrderType, VisibilityConfig } from '../mocks/orders';
import {
  StyledAppBar,
  StyledChaptersContainer,
  StyledContentHeaderWrapper,
  StyledFormulaInput,
  StyledHomePage,
  StyledIconWrapper,
  StyledModalContent,
  StyledModalHeader,
  StyledModalTitle,
  StyledTablesContainer,
} from './StyledHomePage';
import { TablesContainerHeader } from '../components/TablesContainerHeader';
import { MainHeader } from '../components/MainHeader';
import { ContentHeader } from '../components/ContentHeader';
import {
  addDataHandler,
  createDataForVizual,
  getCellName,
} from '../helpers/common';
import { JModal } from '../components/JModal';
import { IconButton } from '../components/IconButton';
import { defaultTagNames, initialTagsData } from '../mocks/tags';
import { getChapters } from '../services/tableService';
import { useInterval } from '../hooks/useInterval';
import { DrawerContentType, useDrawer } from '../hooks/useDrawer';

export const HomePage = () => {
  const hiddenCategories: string[] = _.cloneDeep(HIDDEN_CATEGORIES);
  const chapterList: IChapter[] = _.cloneDeep(chaptersList);

  const [chapters, setChapters] = useState<IChapterInfo[]>([]);
  const [dataForVizual, setDataForVizual] = useState<IDataForVizual>({});

  useEffect(() => {
    getChapters().then((data) => {
      setChapters(data);
      setDataForVizual(
        createDataForVizual(data, chapterList, hiddenCategories)
      );
    });
  }, []);

  const [activeFullScreenChapter, setActiveFullScreenChapter] =
    useState<IChapterInfo | null>(null);
  const chaptersContainer = useRef<HTMLDivElement | null>(null);

  const [isFullScreenMode, setIsFullScreenMode] = useState(false);

  const [visibilityConfig, setVisibilityConfig] =
    useState<VisibilityConfig | null>(null);

  const [addedTags, setAddedTags] =
    useState<Record<string, number[]>>(initialTagsData);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { drawerWidth, openedDrawer, openDrawer, closeDrawer } = useLayout();
  const [drawerContentType, setDrawerContentType] =
    useState<DrawerContentType | null>(null);

  const [showFormulas, setShowFormulas] = useState(false);

  const formulasVisibilityHandler = useCallback(() => {
    setShowFormulas((prev) => !prev);
  }, []);

  const selectedTagsRow = useMemo(
    () =>
      selectedTags.length
        ? selectedTags.reduce<number[]>(
            (arr, tag) => [...arr, ...addedTags[tag]],
            []
          )
        : null,
    [selectedTags]
  );

  const closeRightPanel = () => {
    setDrawerContentType(null);
    setVisibilityConfig(null);
    closeDrawer();
  };

  const toggleRightPanel = useCallback(
    (contentType: DrawerContentType) => {
      if (drawerContentType && contentType === drawerContentType) {
        closeRightPanel();
      } else {
        setDrawerContentType(contentType);
        openDrawer();
      }
    },
    [drawerContentType]
  );

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const changeFullScreenMode = (chapter: IChapterInfo | null) => {
    // const chapterData = chapter ? dataForVizual[chapter.name] : null;
    setIsFullScreenMode(!!chapter);
    setActiveFullScreenChapter(chapter);
    // screenModeService.changeScreenMode(this.isFullScreenMode, chapterData);
  };

  const commonCounter = useMemo(() => {
    const total = Object.values(dataForVizual).reduce(
      (result, item) => result + item.total,
      0
    );
    return Number(isNil(total) ? 0 : total).toLocaleString('de-DE');
  }, [dataForVizual]);

  const updateChapterTotal = (chapterName: string, total: number) => {
    setDataForVizual((prevData) => ({
      ...prevData,
      [chapterName]: {
        ...prevData[chapterName],
        total,
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
  };

  const [formula, setFormula] = useState<string>('');
  const [activeTableName, setActiveTableName] = useState<string>('');
  const [activeCellName, setActiveCellName] = useState<string>('');

  const selectCell = (
    coords: { x: number; y: number },
    worksheet: jspreadsheet.worksheetInstance,
    tableName: string
  ) => {
    const activeCell = worksheet.getCell(coords.x, coords.y) as HTMLElement;

    const cellName = getCellName(coords);

    const data = worksheet.getValue(cellName, false);

    const dataFormula = data.length && data.startsWith('=') ? data : '';

    setActiveTableName(tableName);

    setActiveCellName(cellName);
    setFormula(dataFormula);

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

  const addTag = (tagName: string, row: number) => {
    setAddedTags((data) => ({
      ...data,
      [tagName]: data[tagName].includes(row)
        ? data[tagName].filter((item) => item !== row)
        : [...data[tagName], row],
    }));
  };

  const selectOrder = (order: OrderType) => {
    setVisibilityConfig(order.visibilityConfig);
  };

  const selectTag = (index: number) => {
    setSelectedTags((tags) =>
      tags.includes(defaultTagNames[index])
        ? tags.filter((tag) => tag !== defaultTagNames[index])
        : [...tags, defaultTagNames[index]]
    );
  };

  const { drawerContent, tagsDisplayingNames } = useDrawer({
    selectOrder,
    selectedTags,
    selectTag,
    drawerContentType,
    onClose: closeRightPanel,
  });

  const chaptersArray = useMemo(
    () =>
      !chapters.length
        ? null
        : chapters.map((chapter) => (
          <Chapter
            hide={
              !!(
                activeFullScreenChapter &&
                activeFullScreenChapter?.name !== chapter.name
              ) ||
              (!!visibilityConfig &&
                !visibilityConfig?.visibleChapters.includes(chapter.name))
            }
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
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <img
                    onClick={() => changeFullScreenMode(null)}
                    src={closeArrow}
                    style={{ cursor: 'pointer' }}
                    alt=""
                  />
                )}
                <div className="category-menu" />
              </div>
            }
            details={
              <div className="tables-container">
                <TableComponent
                  setCellCoords={setCellCoords}
                  name={chapter.name}
                  key={chapter.name}
                  setRowData={setInvoiceData}
                  openJModal={() => setIsJModalOpen(true)}
                  visibleCategories={
                    visibilityConfig?.visibleCategories || null
                  }
                  visibleRowsIds={visibilityConfig?.visibleRowsIds || null}
                  categories={chapter.categories}
                  editable
                  selectedTagsRow={selectedTagsRow}
                  isShowFormulas={showFormulas}
                  addTag={addTag}
                  isShowZeroValues
                  tagsDisplayingNames={tagsDisplayingNames}
                  updateChapterTotal={(total) =>
                    updateChapterTotal(chapter.name, total)
                  }
                  selectCell={selectCell}
                />
              </div>
            }
          />
        )),
    [
      activeFullScreenChapter,
      isFullScreenMode,
      showFormulas,
      dataForVizual,
      visibilityConfig?.visibleChapters,
      chapters,
      tagsDisplayingNames,
    ]
  );

  const tableWidth = useMemo(
    () =>
      openedDrawer ? `${document.body.clientWidth - drawerWidth}px` : '100%',
    [drawerWidth, openedDrawer]
  );

  const [undoDisable, setUndoDisable] = useState(true);

  useEffect(() => {
    const index = jspreadsheet.history.actions.findIndex(
      (item: { action: string }) => item.action !== 'deleteWorksheet'
    );
    setUndoDisable(index === -1 || jspreadsheet.history.index < index);
  }, [jspreadsheet.history.index]);

  const changeFormula = (e: any) => {
    // @ts-ignore
    const activeWorksheet: jspreadsheet.worksheetInstance = // @ts-ignore
      (jspreadsheet.spreadsheet as jspreadsheet.spreadsheetInstance[]).find(
        (s) => s.name === activeTableName
      ).worksheets[0];

    const { value } = e.target;

    activeWorksheet.setValue(activeCellName, value, true);
    setFormula(value);
  };

  const closeJModal = (e: object, reason: string) => {
    reason !== 'backdropClick' && setIsJModalOpen(false);
  };

  const savedRef = useRef<HTMLDivElement | null>(null);

  const mainHeaderContent = useMemo(
    () => (
      <MainHeader
        icons={
          <>
            <IconButton
              icon={<HistoryIcon />}
              onClick={() => toggleRightPanel('versions-history')}
              active={openedDrawer && drawerContentType === 'versions-history'}
            />
            <IconButton
              icon={<AccountBalanceWalletIcon />}
              onClick={() => toggleRightPanel('client-orders')}
              active={openedDrawer && drawerContentType === 'client-orders'}
            />
            <IconButton
              icon={<TagIcon />}
              onClick={() => toggleRightPanel('tags')}
              active={openedDrawer && drawerContentType === 'tags'}
            />
            <div ref={savedRef}>
              <SaveIcon />
            </div>
          </>
        }
      />
    ),
    [toggleRightPanel, openedDrawer, drawerContentType]
  );

  const saveData = () => {
    if (savedRef.current?.style) {
      savedRef.current.style.display = 'block';
    }
    addDataHandler(jspreadsheet.spreadsheet, chapters).then(() => {
      if (savedRef.current?.style) {
        savedRef.current.style.display = 'none';
      }
    });
  };

  useInterval(saveData, 10000, [chapters]);

  return (
    <StyledHomePage>
      <StyledAppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        {mainHeaderContent}
      </StyledAppBar>
      <StyledContentHeaderWrapper>
        <ContentHeader
          showFormulas={showFormulas}
          formulasVisibilityHandler={formulasVisibilityHandler}
        />
      </StyledContentHeaderWrapper>
      {showFormulas && (
        <Box display="flex" justifyContent="start" marginTop="10px">
          <FormControlLabel
            labelPlacement="start"
            label="Fx"
            control={
              <StyledFormulaInput value={formula} onChange={changeFormula} />
            }
          />
        </Box>
      )}
      <StyledTablesContainer width={tableWidth}>
        {!isFullScreenMode && (
          <TablesContainerHeader
            undoDisable={undoDisable}
            counter={commonCounter}
            rightPart={
              !openedDrawer && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openModal}
                  sx={{ cursor: 'pointer' }}
                >
                  Create Project
                </Button>
              )
            }
          />
        )}
        <StyledChaptersContainer
          ref={chaptersContainer}
          drawerOpen={openedDrawer}
        >
          {chaptersArray}
        </StyledChaptersContainer>
        <NavigationDrawer navigationDrawerContent={drawerContent} resizable />
      </StyledTablesContainer>
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledModalContent>
          <StyledModalHeader>
            <StyledModalTitle>Create Project</StyledModalTitle>
            <StyledIconWrapper>
              <CloseIcon onClick={closeModal} />
            </StyledIconWrapper>
          </StyledModalHeader>
          <Box display="flex" flexDirection="column" />
        </StyledModalContent>
      </Modal>
      {isJModalOpen && (
        <JModal
          data={invoiceData}
          onClose={closeJModal}
          startCoords={cellCoords || undefined}
        />
      )}
    </StyledHomePage>
  );
};
