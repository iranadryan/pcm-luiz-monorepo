import moment from 'moment';
import { createContext, useContext, useState } from 'react';

interface FilterContextProviderProps {
  children: React.ReactNode;
}

type PropsFilterContext = {
  statusSelected: string;
  setStatusSelected: (value: string) => void;
  filterInput: string;
  setFilterInput: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
};

const DEFAULT_VALUE: PropsFilterContext = {
  statusSelected: 'ALL',
  setStatusSelected: () => null,
  filterInput: '',
  setFilterInput: () => null,
  startDate: moment().subtract(1, 'week').format('DD/MM/YYYY'),
  setStartDate: () => null,
  endDate: moment().format('DD/MM/YYYY'),
  setEndDate: () => null,
};

const FilterContext = createContext<PropsFilterContext>(DEFAULT_VALUE);

export function FilterContextProvider({
  children,
}: FilterContextProviderProps) {
  const [statusSelected, setStatusSelected] = useState(
    DEFAULT_VALUE.statusSelected,
  );
  const [filterInput, setFilterInput] = useState(DEFAULT_VALUE.filterInput);
  const [startDate, setStartDate] = useState(DEFAULT_VALUE.startDate);
  const [endDate, setEndDate] = useState(DEFAULT_VALUE.endDate);

  return (
    <FilterContext.Provider
      value={{
        statusSelected,
        setStatusSelected,
        filterInput,
        setFilterInput,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export const useFilterContext = () => useContext(FilterContext);
