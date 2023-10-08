import React, { useState } from 'react';
import { Tabs, Tab } from '@mui/material';

export default function Finances(): React.ReactNode {
  const [value, setValue] = useState('one');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab value="one" label="Gesamt" />
        <Tab value="two" label="Einnahmen" />
        <Tab value="three" label="Ausgaben" />
      </Tabs>
    </>
  );
}
