import React, { useState, useEffect } from 'react';
import Table from '../Table';
import Dropdown from '../Dropdown';
import Search from '../Search';
import { STATES } from './constants/states';
import { GENRES } from './constants/genres';

const Main = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [displayRestaurants, setDisplayRestaurants] = useState([]);
  const [activeState, setActiveState] = useState('');
  const [activeGenre, setActiveGenre] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getRestaurants = async () => {
    setIsLoading(true);
    const response = await fetch(
      'https://code-challenge.spectrumtoolbox.com/api/restaurants',
      {
        headers: {
          Authorization: 'Api-Key q3MNxtfep8Gt',
        },
      }
    );

    const data = await response.json();
    setIsLoading(false);
    const alphabetizedData = data.sort((a, b) => (a.name > b.name ? 1 : -1));
    setRestaurants(alphabetizedData);
    setDisplayRestaurants(alphabetizedData);
  };

  const handleSelect = e => {
    const targetValue = e.target.value;
    const category = e.target.name.toLowerCase();
    if (category === 'state') {
      setActiveState(targetValue);
    } else if (category === 'genre') {
      setActiveGenre(targetValue);
    }
  };

  const handleSubmit = e => {
    const { value } = e.target;
    e.persist();
    const normalizedValue = value.toLowerCase();
  };

  const filterState = state => {
    if (activeGenre) {
      const filtered = restaurants.filter(
        restaurant =>
          restaurant.state === state &&
          restaurant.genre.toLowerCase().includes(activeGenre)
      );
      setDisplayRestaurants(filtered);
    } else {
      const filtered = restaurants.filter(
        restaurant => restaurant.state === state
      );
      setDisplayRestaurants(filtered);
    }
  };

  const filterGenre = genre => {
    if (activeState) {
      const filtered = restaurants.filter(
        restaurant =>
          restaurant.genre.toLowerCase().includes(genre) &&
          restaurant.state === activeState
      );
      setDisplayRestaurants(filtered);
    } else {
      const filtered = restaurants.filter(restaurant =>
        restaurant.genre.toLowerCase().includes(genre)
      );
      setDisplayRestaurants(filtered);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  useEffect(() => {
    filterState(activeState);
    filterGenre(activeGenre);
  }, [activeState, activeGenre]);

  return (
    <>
      <Search handleSubmit={handleSubmit} />
      <Dropdown name={'State'} opts={STATES} handler={handleSelect} />
      <Dropdown name={'Genre'} opts={GENRES} handler={handleSelect} />
      <Table props={displayRestaurants} />
      <h2>{isLoading ? 'LOADING....' : ''}</h2>
    </>
  );
};

export default Main;
