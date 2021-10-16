// Dependencies.
import React from 'react';
import {render} from 'react-dom';

// Custom components.
import {Search, SearchLoader} from './components/Search';

// Mount apps to DOM.
render(<SearchLoader />, document.querySelector('#search-loader'));
render(<Search />, document.querySelector('#search'));
