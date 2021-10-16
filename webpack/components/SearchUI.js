// 1. Import Dependencies. =====================================================
import React from 'react';
import {
  SearchBox,
  SearchkitManager,
  SearchkitProvider,
  RefinementListFilter,
  InitialLoader,
  Hits,
  HitsStats,
  NoHits,
  Pagination
} from "searchkit";
import * as _ from "lodash";

// 2. Connect elasticsearch with searchkit =====================================
// Set ES url - use a protected URL that only allows read actions.
const ELASTICSEARCH_URL = process.env.REACT_APP_ES_URL;
const ELASTICSEARCH_CREDENTIAL = process.env.REACT_APP_ES_CREDENTIAL;
const sk = new SearchkitManager(
  ELASTICSEARCH_URL,
  {
    searchOnLoad:false,
    basicAuth:ELASTICSEARCH_CREDENTIAL
  });

// Custom hitItem display HTML.
const HitItem = (props) => (
  <div className={props.bemBlocks.item().mix(props.bemBlocks.container("item"))}>
    <a href={ `${props.result._source.url}` }>
      <div className={props.bemBlocks.item("title")} 
        dangerouslySetInnerHTML={{__html:_.get(props.result,"highlight.title",false) || props.result._source.title}}></div>
    </a>
    <div>
      <small className={props.bemBlocks.item("hightlights")}
        dangerouslySetInnerHTML={{__html:_.get(props.result,"highlight.text",'')}}></small>
    </div>
  </div>
);

// 3. Search UI. ===============================================================
const SearchUI = () => {
  const queryOpts = {
    analyzer:"standard"
  };

  return (
    <SearchkitProvider searchkit={sk}>
      <div>
        <div className="sk-layout__top-bar">
          {/* search input box */}
          <SearchBox searchOnChange={true}
                     autoFocus={true}
                     queryOptions={queryOpts}
                     translations={{
                       "searchbox.placeholder": "Type to Search ...",
                       "NoHits.DidYouMean": "Search for {suggestion}."
                     }}

                     queryFields={["text", "title"]}/>
        </div>
        <InitialLoader/>
        <HitsStats/>
        <Pagination showNumbers={true}/>
        <div className="sk-layout__body">
          <div className="sk-layout__filters">
            {/* search faceting */}
            <RefinementListFilter
              id="categories"
              title="Category"
              field="categories.keyword"
              operator="AND"/>
          </div>
          <div className="sk-layout__results">
            {/* search results */}
            <Hits hitsPerPage={5}
                  highlightFields={["title", "text"]}
                  customHighlight={{"fragment_size":30}}
                  itemComponent={HitItem}/>
            {/* if there are no results */}
            <NoHits className="sk-hits" translations={{
              "NoHits.NoResultsFound": "No results were found for {query}",
              "NoHits.DidYouMean": "Search for {suggestion}"
            }} suggestionsField="text"/>
          </div>
        </div>
        <div className="sk-layout__footer">
          Powered by
          &nbsp;<a href="https://searchkit.co" target="_blank">Searchkit</a>&nbsp;,
          &nbsp;<a href="https://app.bonsai.io/" target="_blank">Bonsai</a>&nbsp;,
          &nbsp;<a href="https://www.elastic.co/" target="_blank">Elasticesearch</a>&nbsp;,
          &nbsp;<a href="https://github.com/omc/searchyll" target="_blank">and Searchyll</a>.
        </div>
      </div>
    </SearchkitProvider>
  )
};
export default SearchUI;
