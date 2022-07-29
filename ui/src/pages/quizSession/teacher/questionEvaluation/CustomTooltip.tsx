// recharts doesn't export the default tooltip,
// but it's located in the package lib so you can get to it anyways
import { useState } from 'react';
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';

//Custom tooltip which displays the correct/total answers info
const CustomTooltip = (props) => {
  const [alreadyChanged, setAlreadyChanged] = useState<boolean>(false)
  // payload[0] doesn't exist when tooltip isn't visible
  if (props.payload[0] != null) {
    // mutating props directly is against react's conventions
    // so we create a new payload with the name and value fields set to what we want
    if(!alreadyChanged){
      props.payload[0].payload.Total = props.payload[0].payload.Total + props.payload[0].payload.Correct
      setAlreadyChanged(true)
    }

    // we render the default, but with our overridden payload
    return <DefaultTooltipContent {...props} />;
  }

  // we just render the default
  return <DefaultTooltipContent {...props} />;
};

export default CustomTooltip