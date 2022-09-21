import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Checkbox } from 'components/ui/inline/Checkbox/Checkbox';
import { Button } from 'components/ui/inline/Button/Button';
import { Section } from 'components/ucsf/Section/Section';
import { Layout } from 'components/ucsf/Layout/Layout';

import {
  eligibilityMap,
  Eligibility,
  EligibilityGroup,
} from './ucsfEligibilitiesMap';
import styles from './UcsfClientEligibilityPage.module.scss';

interface SelectedEligibilities {
  [key: string]: boolean;
}

const ClientEligibilities = ({
  resourceEligibilityGroups, selectedEligibilities, setSelectedEligibilities, resourceSlug,
}: {
  resourceEligibilityGroups: EligibilityGroup[];
  selectedEligibilities: SelectedEligibilities;
  setSelectedEligibilities: (categories: SelectedEligibilities) => void;
  resourceSlug: string;
}) => {
  useEffect(() => {
    setEligibilityGroupList(resourceEligibilityGroups);
  }, [resourceSlug]);

  const [eligibilityGroupList, setEligibilityGroupList] = useState<EligibilityGroup[]>(
    resourceEligibilityGroups,
  );

  const handleEligibilityClick = (
    eligibility: Eligibility,
    eligibilities: Eligibility[],
  ) => {
    const seeAllEligibilityItem = eligibilities.find(e => e.isSeeAll);
    const eligibilityCheckedId = eligibility.checkedId;
    const targetValue = !selectedEligibilities[eligibilityCheckedId];

    if (eligibility.isSeeAll) {
      // Check or uncheck all boxes in accordance with "See All" checked value
      massToggleGroupEligibilities(eligibilities, targetValue);
    } else {
      const updatedEligibilities = {
        ...selectedEligibilities,
        [eligibilityCheckedId]: targetValue,
      };

      // If target checked value is false, uncheck "See All" box as well
      if (!targetValue) {
        // N.B. Use of "!" assumes that every Eligibility array will have a "See All" element
        updatedEligibilities[seeAllEligibilityItem!.checkedId] = false;
      }

      setSelectedEligibilities(updatedEligibilities);
    }
  };

  // Toggles all eligibilities in accordance with the toggleState argument
  const massToggleGroupEligibilities = (
    eligibilities: Eligibility[],
    toggleState: boolean,
  ) => {
    const updatedEligibilities = {
      ...selectedEligibilities,
    };

    eligibilities.forEach(eligibility => {
      updatedEligibilities[eligibility.checkedId] = toggleState;
    });

    setSelectedEligibilities(updatedEligibilities);
  };

  return (
    <div className={styles.eligibilitiesBox}>
      <div className={styles.eligibilitiesBox_title}>Client Identity</div>
      <ol className={styles.eligibilitiesLabels}>
        {eligibilityGroupList.map(eligibilityGroup => (
          <li key={eligibilityGroup.label} className={styles.listContainer}>
            <span className={styles.eligibilityGroupLabel}>
              {eligibilityGroup.label}
            </span>
            <ul className={styles.eligibilitiesList}>
              {eligibilityGroup.eligibilities.map(eligibility => (
                <li key={`${eligibilityGroup.label}-${eligibility.name}`} className={styles.eligibilityGroup}>
                  <Checkbox
                    onChange={() => handleEligibilityClick(
                      eligibility,
                      eligibilityGroup.eligibilities,
                    )}
                    name={eligibilityGroup.label}
                    id={`${eligibilityGroup.label}-${eligibility.name}`}
                    checked={selectedEligibilities[eligibility.checkedId] || false}
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

const Page = () => {
  const [selectedEligibilities, setSelectedEligibilities] = useState<SelectedEligibilities>({});

  interface LocationState {
    selectedResourceSlug: string;
    selectedEligibilityNames: string[];
  }

  const history = useHistory<LocationState>();
  const { state } = history.location;
  const selectedResourceSlug = state && state.selectedResourceSlug;
  const resourceEligibilityGroups = eligibilityMap[selectedResourceSlug];

  const goToServiceTypePage = (slug: string) => {
    const flattenedEligibilityGroups = resourceEligibilityGroups.reduce<Eligibility[]>(
      (previousValue, currentValue) => previousValue.concat(currentValue.eligibilities),
      [],
    );

    const selectedEligibilityNames = flattenedEligibilityGroups.reduce<string[]>((
      result,
      eligibility,
    ) => {
      if (selectedEligibilities[eligibility.checkedId] && !eligibility.isSeeAll) {
        return [...result, eligibility.name];
      }
      return result;
    }, []);

    history.push('/service-type', { selectedResourceSlug: slug, selectedEligibilityNames });
  };

  const backToResourceSelection = () => {
    history.push('/');
  };

  if (!selectedResourceSlug) {
    history.push('/');
    return null;
  }

  return (
    <div className={styles.eligibilityPage}>
      <Section
        addClass={styles.subtitleMargin}
        subtitle="Step 2: Can you tell us more about your client and their needs?"
      />
      <div className={styles.eligibilitiesContainer}>
        <ClientEligibilities
          resourceEligibilityGroups={resourceEligibilityGroups}
          selectedEligibilities={selectedEligibilities}
          setSelectedEligibilities={setSelectedEligibilities}
          resourceSlug={selectedResourceSlug}
        />
        <div className={styles.eligibilitiesBtns}>
          <Button
            onClick={backToResourceSelection}
          >
            Back
          </Button>
          <Button
            onClick={() => { goToServiceTypePage(selectedResourceSlug); }}
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
    <Page />
  </Layout>
);
