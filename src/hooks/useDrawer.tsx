import React, { ReactNode, useMemo, useState } from "react";
import { versions } from "../mocks/versions";
import { VersionComponent } from "../components/VersionComponent";
import { orders, OrderType } from "../mocks/orders";
import { OrderComponent } from "../components/OrderComponent";
import { defaultTagNames, tagColors } from "../mocks/tags";
import { TagComponent } from "../components/TagComponent";
import { Box} from "@mui/material";
import { StyledIconWrapper, StyledRightPanelHeader } from "../pages/StyledHomePage";
import CloseIcon from "@mui/icons-material/Close";

export type DrawerContentType = 'versions-history' | 'client-orders' | 'tags';

type PropsType = {
  selectOrder: (order: OrderType) => void;
  selectedTags: string[];
  selectTag: (index: number) => void;
  drawerContentType: DrawerContentType | null;
  onClose: () => void;
};

export const useDrawer = ({ selectOrder, selectedTags, selectTag, drawerContentType, onClose }: PropsType ) => {
  const [tagsDisplayingNames, setTagsDisplayingNames] = useState<string[]>(defaultTagNames);

  const drawerContentTitleMap: Record<DrawerContentType, string> = {
    'client-orders': 'Client orders',
    'versions-history': 'Versions history',
    'tags': 'Tags',
  };

  const versionsList = useMemo(() =>
    versions.map(
      (version) => (
        <VersionComponent id={version.id} date={version.date} key={version.id}/>
      )
    ), []
  );

  const ordersList = useMemo(() =>
    orders.map(
      (order) => (
        <OrderComponent key={order.id} name={order.name} date={order.date} cost={order.cost } onSelectOrder={() => selectOrder(order)}/>
      )
    ), []
  );

  const tagsList = useMemo(() =>
    tagColors.map(
      (color, index) => (
        <TagComponent
          key={color}
          selected={selectedTags.includes(defaultTagNames[index])}
          color={color}
          name={tagsDisplayingNames[index]}
          onChangeName={(newName: string) => {
            setTagsDisplayingNames(
              tagsDisplayingNames.map(
                (oldName, i) => index === i ? newName : oldName
              )
            );
          }}
          onSelectTag={() => selectTag(index)}
        />
      )
    ), [tagsDisplayingNames, selectedTags]
  );

  const drawerContentListMap: Record<DrawerContentType, ReactNode[]> = {
    'client-orders': ordersList,
    'versions-history': versionsList,
    'tags': tagsList,
  };

  const drawerContent = useMemo(
    () => <Box role="presentation" style={{ width: '300px', marginTop: '50px' }}>
      <StyledRightPanelHeader>
        {drawerContentType && <h2>{drawerContentTitleMap[drawerContentType]}</h2>}
        <StyledIconWrapper>
          <CloseIcon onClick={onClose} sx={{ cursor: 'pointer' }}/>
        </StyledIconWrapper>
      </StyledRightPanelHeader>
      <Box display="flex" flexDirection="column" gap="12px" padding="12px">
        {drawerContentType && drawerContentListMap[drawerContentType]}
      </Box>
    </Box>, [drawerContentType, tagsDisplayingNames, selectedTags]
  );

  return {
    drawerContent,
    tagsDisplayingNames,
  }
}

