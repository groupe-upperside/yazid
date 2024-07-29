import { NumberField } from '@prismicio/client';

export const getGridColsClass = (numberPerRow: NumberField) => {
  switch (numberPerRow) {
    case 1:
      return 'xl:grid-cols-1';
    case 2:
      return 'xl:grid-cols-2';
    case 3:
      return 'xl:grid-cols-3';
    case 4:
      return 'xl:grid-cols-4';
    case 5:
      return 'xl:grid-cols-5';
    case 6:
      return 'xl:grid-cols-6';
    default:
      return 'xl:grid-cols-2';
  }
};
