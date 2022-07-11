import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Checkbox } from 'components/ui/inline/Checkbox/Checkbox';
import { Button } from 'components/ui/inline/Button/Button';
import { Section } from 'components/ucsf/Section/Section';
import { Layout } from 'components/ucsf/Layout/Layout';

import { eligibilityData } from './ucsfEligibilities';
import styles from './UcsfClientEligibilityPage.module.scss';

const ClientEligibilities = ({ eligibilities, resourceSlug }: {
  eligibilities: any;
  resourceSlug: string;
}) => {
  const resourceEligibilities = eligibilities[resourceSlug];
  const [eligibilityGroupList, setEligibilityGroupList] = useState(resourceEligibilities);

  interface clientEligibility {
    checked: boolean;
    name: string;
  }

  interface clientEligibilityGroup {
    label: string;
    eligibilities: clientEligibility[];
  }

  // Todo: This setEligibilityGroup and toggleChecked logic could change pretty drastically
  // once the API returns eligibility data. The shape of that data is still under discussion
  // between product and dev
  const setEligibilityGroup = (index: number, updatedEligibilityGroup: clientEligibilityGroup) => {
    const updatedList = [
      ...eligibilityGroupList.slice(0, index),
      updatedEligibilityGroup,
      ...eligibilityGroupList.slice(index + 1),
    ];

    setEligibilityGroupList(updatedList);
  };

  const toggleChecked = (eligibilityGroup: clientEligibilityGroup, eligibilityIndex: number) => {
    const updatedEligibility = {
      ...eligibilityGroup.eligibilities[eligibilityIndex],
      checked: !eligibilityGroup.eligibilities[eligibilityIndex].checked,
    };

    const updatedEligibilities = [
      ...eligibilityGroup.eligibilities.slice(0, eligibilityIndex),
      updatedEligibility,
      ...eligibilityGroup.eligibilities.slice(eligibilityIndex + 1),
    ];

    return {
      ...eligibilityGroup,
      eligibilities: updatedEligibilities,
    };
  };

  return (
    <div className={styles.eligibilitiesBox}>
      <div className={styles.eligibilitiesBox_title}>Client Identity</div>
      <ol className={styles.eligibilitiesLabels}>

        {/* Todo: This list rendering logic will be refactored when the API is setup */}
        {eligibilityGroupList.map((eligibilityGroup: clientEligibilityGroup, index: number) => (
          <li key={eligibilityGroup.label} className={styles.listContainer}>
            <span className={styles.eligibilityGroupLabel}>
              {eligibilityGroup.label}
            </span>
            <ul className={styles.eligibilitiesList}>
              {eligibilityGroup.eligibilities.map((eligibility, i) => (
                <li key={`${eligibilityGroup.label}-${eligibility.name}`} className={styles.eligibilityGroup}>
                  <Checkbox
                    onChange={() => setEligibilityGroup(index, toggleChecked(eligibilityGroup, i))}
                    name={eligibilityGroup.label}
                    id={`${eligibilityGroup.label}-${eligibility.name}`}
                    checked={eligibility.checked}
                  />
                  <label className={styles.eligibilityLabel} htmlFor={`${eligibilityGroup.label}-${eligibility.name}`}>
                    {eligibility.name}
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
};

const Page = ({ eligibilities }: {
  eligibilities: any;
}) => {
  const history = useHistory();
  interface LocationState {
    selectedResourceSlug: string;
  }

  const state = history.location.state as LocationState;
  const goToResourceResults = () => {
    history.push(`/${state.selectedResourceSlug}/results`);
  };

  const backToResourceSelection = () => {
    history.push('/');
  };

  return (
    <div className={styles.eligibilityPage}>
      <Section
        addClass={styles.subtitleMargin}
        subtitle="Step 2: Can you tell us more about your client and their needs?"
      />
      <div className={styles.eligibilitiesContainer}>
        <ClientEligibilities
          eligibilities={eligibilities}
          resourceSlug={state.selectedResourceSlug}
        />
        <div className={styles.eligibilitiesBtns}>
          <Button
            onClick={backToResourceSelection}
          >
            Back
          </Button>
          <Button
            onClick={goToResourceResults}
            addClass={styles.goToResultsBtn}
          >
            Next: Service Capacity
          </Button>
        </div>
      </div>
    </div>
  );
};

export const UcsfClientEligibilityPage = () => (
  <Layout>
    <Page
      eligibilities={eligibilityData}
    />
  </Layout>
);

/**
 * Todo: The below is a general sketch of how we will fetch eligibility data using the category
 * IDs of the selected UCSF resources. Before we can do this, UCSF resources in our DB will need
 * to have associated eligibilities and category IDs

  interface resourceListItem {
    id: string;
    name: string;
    icon: string;
    checked: boolean;
  }

  // const location = useLocation();
  interface stateType {
    selectedResources: resourceListItem[];
  }

  const { state } = useLocation<stateType>();
  const selectedResources = state.selectedResources;
  const resourceEligibilities: object[] = [];

  selectedResources.forEach((resource) => {
    const eligibilities = useEligibilitiesForCategory(resource.id) || [];
    resourceEligibilities.push(...eligibilities);
  });
*/
