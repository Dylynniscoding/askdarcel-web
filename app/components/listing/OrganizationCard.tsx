import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import StreetViewImage from 'components/maps/StreetViewImage';
import { Organization } from '../../models';

export const OrganizationCard = ({ org }: { org: Organization }) => {
  const address = org.addresses[0];
  const shortDescription = useMemo(() => org.short_description || org.long_description?.split('\n')[0], [org]);
  const maxHeight = '106px';
  console.log({ org, address });

  return (
    <Link to={`/organizations/${org.id}`} className="card" style={{ maxHeight }}>
      <StreetViewImage address={address} size={maxHeight} />
      <header className="content">
        <h3>{ org.name }</h3>
        <h4>
          <span>{ address.address_1 }</span>
          {/* TODO Walking distance */}
        </h4>
        {/* TODO Add Rating */}
        <p>{shortDescription}</p>
      </header>
    </Link>
  );
};
