import React from 'react';
import SearchUI from './SearchUI';

const SearchLoader = () => {
  const openSearchUI = () => {
    document.querySelector(".sk-layout").classList.add("is-active");
    setTimeout(function() {
      document.querySelector(".sk-search-box__text").focus();
    }, 500);
  };

  return (
    <span className="page-link sk-search-loader fa fa-search" onClick={openSearchUI} />
  )
};

const Search = () => {
  const [showSearchUI, setShowSearchUI] = React.useState(false);
  const closeSearchUI = () => document.querySelector(".sk-layout").classList.remove("is-active");
  const escSearchUI = (event) => {
    if (event.keyCode == 27) {
      closeSearchUI();
    }
  };

  return (
    <div className="sk-layout" onKeyUp={escSearchUI}>
      <div className="sk-layout__wrapper">
        <span className="sk-layout__close fa fa-times"  onClick={closeSearchUI} />
        <SearchUI />
      </div>
    </div>
  )
};

export {SearchLoader, Search};
