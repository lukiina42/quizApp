import { useState } from "react";

//Anchor state, holds the DOM element where the popover should be

export function useAnchor() {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const open = Boolean(anchorEl);

  //Opens options about clicked quiz
  const handleOptionsOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //Closes options
  const handleClose = () => {
    setAnchorEl(null);
  };

  return {
    handleClose,
    handleOptionsOpen,
    anchor: anchorEl,
    open,
  };
}
