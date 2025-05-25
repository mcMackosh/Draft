import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TaskFilterRequest } from '../type/task';

export const defaultFilters: TaskFilterRequest = {
  SortByDeadline: 'desc',
  TagIds: [],
  ExecutorIds: [],
  Priorities: [],
  Statuses: [],
  SearchQuery: '',
};

export const useTaskFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<TaskFilterRequest>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<TaskFilterRequest>(defaultFilters);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Ініціалізація фільтрів з URL при першому завантаженні
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const urlFilters: TaskFilterRequest = {
      // SortByDeadline: params.SortByDeadline || defaultFilters.SortByDeadline,
      TagIds: params.TagIds ? params.TagIds.split(',').map(Number) : defaultFilters.TagIds,
      ExecutorIds: params.ExecutorIds ? params.ExecutorIds.split(',').map(Number) : defaultFilters.ExecutorIds,
      Priorities: params.Priorities ? params.Priorities.split(',') : defaultFilters.Priorities,
      Statuses: params.Statuses ? params.Statuses.split(',') : defaultFilters.Statuses,
      SearchQuery: params.SearchQuery || defaultFilters.SearchQuery,
    };
    
    setFilters(urlFilters);
    setAppliedFilters(urlFilters);
    setIsInitialLoad(false);
  }, [searchParams]);

  // Функція для застосування фільтрів
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else if (value && value !== defaultFilters[key as keyof TaskFilterRequest]) {
        params.set(key, value.toString());
      }
    });

    setSearchParams(params);
    setAppliedFilters(filters);
  }, [filters, setSearchParams]);

  // Функція для оновлення фільтрів (без зміни URL)
  const updateFilter = <K extends keyof TaskFilterRequest>(key: K, value: TaskFilterRequest[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Функція для скидання фільтрів (без зміни URL поки не застосовано)
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // Генерація рядка фільтрів для API запиту
  const filtersString = useCallback(() => {
    return Object.entries(appliedFilters)
      .filter(([key, value]) => {
        return value && value !== defaultFilters[key as keyof TaskFilterRequest] && 
              (Array.isArray(value) ? value.length > 0 : true);
      })
      .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : value}`)
      .join('&');
  }, [appliedFilters]);

  return {
    filters,
    appliedFilters,
    updateFilter,
    resetFilters,
    applyFilters,
    filtersString,
  };
};