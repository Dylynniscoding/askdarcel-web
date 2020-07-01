import React from 'react';
import { connectStateResults } from 'react-instantsearch/connectors';
import { parseAlgoliaSchedule } from 'utils/transformSchedule';
import styles from './SearchResults.scss';

/**
 * Transform Algolia search hits such that each hit has a recurringSchedule that
 * uses the time helper classes.
 */
const transformHits = hits => hits.map(hit => {
  const inheritedSchedule = (
    hit.schedule && hit.schedule.length ? hit.schedule : hit.resource_schedule
  );
  const recurringSchedule = (
    inheritedSchedule && inheritedSchedule.length
      ? parseAlgoliaSchedule(inheritedSchedule)
      : null
  );
  return { ...hit, recurringSchedule };
});

const SearchResults = ({ searchResults }) => {
  if (!searchResults) return null;

  const hits = transformHits(searchResults.hits);

  return (
    <div className={styles.searchResultsContainer}>
      <div>
        { hits.map((hit, index) => <SearchResult hit={hit} index={index} key={hit.id} />) }
      </div>
    </div>
  );
};

const SearchResult = ({ hit, index }) => {
  const renderAddressMetadata = hit_ => {
    if (hit_.addresses.length === 0) {
      return <span>No address found</span>;
    }
    if (hit_.addresses.length > 1) {
      return <span>Multiple locations</span>;
    }
    if (hit_.addresses[0].address_1) {
      return <span>{hit_.addresses[0].address_1}</span>;
    }
    return <span>No address found</span>;
  };
  const phoneNumber = hit.phones.length > 0 && hit.phones[0].number;
  return (
    <div className={styles.searchResult}>
      <div className={styles.searchText}>
        <div className={styles.title}>{ `${index + 1}. ${hit.name}`}</div>
        <div className={styles.address}>{renderAddressMetadata(hit)}</div>
        <div className={styles.description}>{hit.long_description}</div>
        <div className={styles.serviceOf}>{hit.service_of}</div>
      </div>
      <div className={styles.sideLinks}>
        {
          phoneNumber
          && (
            <div className={styles.sideLinkText}>
              <a href={`tel${phoneNumber}`}>{`Call ${phoneNumber}`}</a>
            </div>
          )
        }
        {
          (hit._geoloc && hit.addresses[0].address_1)
          && (
            <div className={styles.sideLinkText}>
              <a href={`http://google.com/maps/dir/?api=1&destination=${hit._geoloc}`}>Get directions</a>
            </div>
          )
        }
        <div />
        {
          hit.url
          && (
            <div className={styles.sideLinkText}>
              <a href={hit.url} className={styles.sideLinkText}>Go to Website</a>
            </div>
          )
        }
        {
          (phoneNumber || hit._geoloc || hit.url)
          && <div className={styles.divider} />
        }
        <a href="http://localhost:8081/" className={styles.sideLinkText}>Report Error</a>
      </div>
    </div>
  );
};

// Connects the Algolia searchState and searchResults to this component
// Learn more here: https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
export default connectStateResults(SearchResults);
