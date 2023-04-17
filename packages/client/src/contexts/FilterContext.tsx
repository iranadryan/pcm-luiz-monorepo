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
  startDate: '',
  setStartDate: () => null,
  endDate: '',
  setEndDate: () => null,
};

const FilterContext = createContext<PropsFilterContext>(DEFAULT_VALUE);

export function FilterContextProvider({
  children,
}: FilterContextProviderProps) {
  const [statusSelected, setStatusSelected] = useState('ALL');
  const [filterInput, setFilterInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
