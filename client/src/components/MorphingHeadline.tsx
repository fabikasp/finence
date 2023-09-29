import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { assertNonNullable } from '../utils/assert';

const TIME_TO_MORPH_IN_SEC = 0.2;
const MORPH_TIME_IN_SEC = 3.2;

const StyledTypography = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  display: 'inline-block',
  textAlign: 'center',
  userSelect: 'none',
  fontFamily: 'LeckerliOne',
  fontSize: theme.typography.h3.fontSize,
  [theme.breakpoints.up('md')]: {
    fontSize: theme.typography.h2.fontSize
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: theme.typography.h1.fontSize
  }
}));

const StyledBox = styled(Box)(({ theme }) => ({
  marginBottom: 100,
  [theme.breakpoints.up('md')]: {
    marginBottom: 120
  },
  [theme.breakpoints.up('lg')]: {
    marginBottom: 150
  }
}));

export default function MorphingHeadline(): React.ReactNode {
  useEffect(() => {
    const sourceText = document.getElementById('sourceText');
    const targetText = document.getElementById('targetText');

    let startTime = new Date();
    let timeToMorph = TIME_TO_MORPH_IN_SEC;
    let morph = 0;

    const animate = () => {
      const animationHandle = requestAnimationFrame(animate);

      const currentTime = new Date();
      const timeDifference = (currentTime.getTime() - startTime.getTime()) / 1000;

      startTime = currentTime;
      timeToMorph -= timeDifference;

      try {
        if (timeToMorph <= 0) {
          morph -= timeToMorph;
          timeToMorph = 0;

          let quotient = Math.min(morph / MORPH_TIME_IN_SEC, 1);

          assertNonNullable(targetText);
          targetText.style.filter = `blur(${Math.min(8 / quotient - 8, 100)}px)`;
          targetText.style.opacity = `${Math.pow(quotient, 0.4) * 100}%`;

          assertNonNullable(sourceText);
          quotient = 1 - quotient;
          sourceText.style.filter = `blur(${Math.min(8 / quotient - 8, 100)}px)`;
          sourceText.style.opacity = `${Math.pow(quotient, 0.4) * 100}%`;

          targetText.textContent = 'Finence';
        }
      } catch (e) {
        cancelAnimationFrame(animationHandle);
      }
    };

    animate();
  }, []);

  return (
    <>
      <Box sx={{ filter: 'url(#threshold) blur(0.6px)' }}>
        <StyledTypography id="sourceText">Fine Finance</StyledTypography>
        <StyledTypography id="targetText" />
      </Box>
      <StyledBox />
      <Box component="svg" display="none">
        <Box component="defs">
          <Box component="filter" id="threshold">
            <Box
              component="feColorMatrix"
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
