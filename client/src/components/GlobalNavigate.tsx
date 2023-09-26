import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export let globalNavigate: NavigateFunction;

export default function GlobalNavigate(): React.ReactNode {
  globalNavigate = useNavigate();

  return null;
}
