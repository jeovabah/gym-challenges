import Svg, { Path } from "react-native-svg";
import { useTheme } from "styled-components/native";

export const ProgressBorderSVG = ({ percentage }: { percentage: number }) => {
  const theme = useTheme();
  const width = 400;
  const height = 300;
  const strokeWidth = 8;
  const radius = 50;
  const verticalMargin = 1;
  const horizontalMargin = 4;

  const startX = width / 2;
  const startY = verticalMargin;

  let path = `M ${startX} ${startY}`;

  const totalLength =
    2 * (width - 2 * radius) + 2 * (height - 2 * radius) + 2 * Math.PI * radius;
  const targetLength = (percentage / 100) * totalLength;
  let currentLength = 0;

  const halfTopLength = width / 2 - radius - horizontalMargin;
  if (currentLength + halfTopLength <= targetLength) {
    path += ` L ${width - radius - horizontalMargin} ${verticalMargin}`;
    currentLength += halfTopLength;
  } else {
    const x = startX + (targetLength - currentLength);
    path += ` L ${x} ${verticalMargin}`;
    return (
      <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={path}
          stroke={theme.colors.secondary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  path += ` A ${radius} ${radius} 0 0 1 ${width - horizontalMargin} ${
    radius + verticalMargin
  }`;
  currentLength += (Math.PI * radius) / 2;

  if (currentLength >= targetLength) {
    const remainingAngle =
      ((targetLength - (currentLength - (Math.PI * radius) / 2)) /
        ((Math.PI * radius) / 2)) *
      90;
    const angleRad = remainingAngle * (Math.PI / 180);
    const x = width - radius - horizontalMargin + radius * Math.sin(angleRad);
    const y = verticalMargin + radius * (1 - Math.cos(angleRad));
    path = `M ${startX} ${startY} L ${
      width - radius - horizontalMargin
    } ${verticalMargin} A ${radius} ${radius} 0 0 1 ${x} ${y}`;
    return (
      <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={path}
          stroke={theme.colors.secondary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  const rightSideLength = height - 2 * radius;
  if (currentLength + rightSideLength <= targetLength) {
    path += ` L ${width - horizontalMargin} ${
      height - radius - verticalMargin
    }`;
    currentLength += rightSideLength;
  } else {
    const y = radius + verticalMargin + (targetLength - currentLength);
    path += ` L ${width - horizontalMargin} ${y}`;
    return (
      <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={path}
          stroke={theme.colors.secondary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  path += ` A ${radius} ${radius} 0 0 1 ${width - radius - horizontalMargin} ${
    height - verticalMargin
  }`;
  currentLength += (Math.PI * radius) / 2;

  const bottomLength = width - 2 * radius;
  if (currentLength + bottomLength <= targetLength) {
    path += ` L ${radius + horizontalMargin} ${height - verticalMargin}`;
    currentLength += bottomLength;
  } else {
    const x =
      width - radius - horizontalMargin - (targetLength - currentLength);
    path += ` L ${x} ${height - verticalMargin}`;
    return (
      <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={path}
          stroke={theme.colors.secondary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  path += ` A ${radius} ${radius} 0 0 1 ${horizontalMargin} ${
    height - radius - verticalMargin
  }`;
  currentLength += (Math.PI * radius) / 2;

  if (currentLength + rightSideLength <= targetLength) {
    path += ` L ${horizontalMargin} ${radius + verticalMargin}`;
    currentLength += rightSideLength;
  } else {
    const y = height - radius - verticalMargin - (targetLength - currentLength);
    path += ` L ${horizontalMargin} ${y}`;
    return (
      <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={path}
          stroke={theme.colors.secondary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  path += ` A ${radius} ${radius} 0 0 1 ${
    radius + horizontalMargin
  } ${verticalMargin}`;
  currentLength += (Math.PI * radius) / 2;

  if (currentLength + halfTopLength <= targetLength) {
    path += ` L ${startX} ${startY}`;
  } else {
    const x = radius + horizontalMargin + (targetLength - currentLength);
    path += ` L ${x} ${verticalMargin}`;
  }

  return (
    <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
      <Path
        d={path}
        stroke={theme.colors.secondary}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
};
