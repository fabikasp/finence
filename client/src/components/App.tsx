import React from 'react';
import { useDispatch } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebase';
import { setFirebase } from '../store/firebaseSlice';

export function App() {
  const dispatch = useDispatch();

  const app = initializeApp(firebaseConfig); // Init Firebase
  dispatch(setFirebase(app)); // TODO: Fixen

  return <h1>Hello World!</h1>;
}
