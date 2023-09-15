import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { assertNonNullable } from '../utils/assert';

const TIME_TO_MORPH_IN_SEC = 0.2;
const MORPH_TIME_IN_SEC = 3.2;

const Container = styled('div')(() => ({
  position: 'absolute',
  margin: 'auto',
  width: '100vw',
  height: '80pt',
  top: 0,
  bottom: 0,
  filter: 'url(#threshold) blur(0.6px)'
}));

const StyledTypography = styled(Typography)(() => ({
  position: 'absolute',
  width: '100%',
  display: 'inline-block',
  fontSize: '70pt',
  textAlign: 'center',
  userSelect: 'none'
}));

export default function LoginPage(): React.ReactElement {
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
      <Container>
        <StyledTypography id="sourceText" variant="h5">
          Fine Finance
        </StyledTypography>
        <StyledTypography id="targetText" variant="h5" />
      </Container>
      <Box component="svg" id="filters">
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
