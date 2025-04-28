
import { NavigateFunction } from 'react-router-dom';

let navigator: NavigateFunction;

export const setNavigator = (n: NavigateFunction) => {
  navigator = n;
};

export const navigate = (to: string) => {
  if (navigator) {
    navigator(to);
  }
};