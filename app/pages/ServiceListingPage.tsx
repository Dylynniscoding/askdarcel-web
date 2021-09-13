import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import 'react-tippy/dist/tippy.css';
import {
  ActionSidebar,
  ServiceAttribution,
  TableOfContactInfo,
  TableOfOpeningTimes,
  MobileActionBar,
  MOHCDBadge,
} from 'components/listing';
import { Datatable, Loader } from 'components/ui';
import { ServiceCard, ListingTitleLink } from 'components/layout';
import { MapOfLocations } from 'components/maps';
import whiteLabel from '../utils/whitelabel';
import {
  fetchService,
  generateServiceDetails,
  getServiceLocations,
  Organization,
  Service,
} from '../models';

const { title: whiteLabelTitle } = whiteLabel;

// Page at /services/123
export const ServiceListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    fetchService(id as any)
      .then(s => setService(s));
    // TODO Handle Errors
  }, [id]);

  if (!service) { return <Loader />; }

  const { resource, recurringSchedule } = service;
  const locations = getServiceLocations(service, resource, recurringSchedule);

  return (
    <div className="listing-container">
      <Helmet>
        <title>{`${service.name} | ${whiteLabelTitle}`}</title>
        <meta name="description" content={service.long_description} />
      </Helmet>
      <article className="listing" id="service">
        <div className="listing--main">
          <div className="listing--main--left">
            <header>
              <div className="org--main--header--title-container">
                <h1 data-cy="service-page-title">{service.name}</h1>
                <MOHCDBadge resource={resource} />
              </div>
              {/* {service.alsoNamed ? <p>Also Known As</p> : null} */}
              <ServiceProgramDetails service={service} organization={resource} />
            </header>

            <MobileActionBar resource={resource} service={service} />

            <ServiceListingSection title="About This Service" data-cy="service-about-section">
              <ReactMarkdown className="rendered-markdown" source={service.long_description} />
              <ServiceAttribution
                attribution={resource.source_attribution}
                status={resource.status}
              />
            </ServiceListingSection>

            <ServiceDetailsTableSection service={service} />

            <ServiceListingSection title="Contact Info" data-cy="service-contact-section">
              <TableOfContactInfo item={service} />
            </ServiceListingSection>

            <ServiceListingSection title="Location and Hours" data-cy="service-loc-hours-section">
              <MapOfLocations
                locations={locations}
                locationRenderer={(location: any) => (
                  <TableOfOpeningTimes recurringSchedule={location.recurringSchedule} />
                )}
              />
              {/* TODO Transport Options */}
            </ServiceListingSection>

            {resource.services.length > 1 && (
              <ServiceListingSection title="Other Services at this Location" data-cy="service-other-section">
                {resource.services
                  .filter(srv => srv.id !== service.id)
                  .map(srv => (
                    <ServiceCard service={srv} key={srv.id} />
                  ))}
              </ServiceListingSection>
            )}

            {/* TODO Need an API to get similar services, maybe same category for now? */}
            {/* <section>
                <h2>Similar Services Near You</h2>
              </section>
            */}
          </div>
          <div className="listing--aside">
            <ActionSidebar resource={resource} service={service} />
          </div>
        </div>
      </article>
    </div>
  );
};

type ServiceListingSectionProps = { title: string } & React.HTMLProps<HTMLDivElement>

// A title with the content of a section
export const ServiceListingSection = (
  { children, title, ...props }: ServiceListingSectionProps,
) => (
  <section {...props}>
    <h2>{title}</h2>
    {children}
  </section>
);

type ServiceProgramDetailsProps = { service: Service; organization: Organization }

// TODO Implement rendering/popover when programs exist
// Details if the service is part of a larger program, and the organization that provides it
export const ServiceProgramDetails = ({ service, organization }: ServiceProgramDetailsProps) => (
  <p>
    A service
    { service.program ? ` in the ${service.program.name} program` : null }
    { ' offered by ' }
    <ListingTitleLink type="org" listing={organization} />
  </p>
);

// Shows a section with relevant service fields in a table
export const ServiceDetailsTableSection = ({ service }: { service: Service }) => {
  const details = useMemo(() => generateServiceDetails(service), [service]);

  return details.length ? (
    <ServiceListingSection title="Service Details" data-cy="service-details-section">
      <Datatable
        rowRenderer={(d: { title: string; value: string }) => (
          <tr key={d.title}>
            <th>{d.title}</th>
            <td><ReactMarkdown className="rendered-markdown">{d.value}</ReactMarkdown></td>
          </tr>
        )}
        rows={details}
      />
    </ServiceListingSection>
  ) : null;
};
