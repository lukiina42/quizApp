import { useState } from "react";

export interface AnchorType {
  element: Element | null;
  id: number;
}

//Anchor state, holds the DOM element where the popover should be
//displayed and id (key) of the quiz about which the popover displays possibilities
const anchorInitial: AnchorType = {
  element: null,
  id: 0,
};

export function useAnchor() {
  const [anchorEl, setAnchorEl] = useState<AnchorType>(anchorInitial);

  const open = Boolean(anchorEl.element);

  //Opens options about clicked quiz
  const handleOptionsOpen = (event, idToSet: number) => {
    setAnchorEl({
      element: event.currentTarget,
      id: idToSet,
    });
  };

  //Closes options
  const handleClose = () => {
    setAnchorEl(anchorInitial);
  };

  return {
    handleClose,
    handleOptionsOpen: (event, idToSet: number) =>
      handleOptionsOpen(event, idToSet),
    anchor: anchorEl,
    open,
  };
}
