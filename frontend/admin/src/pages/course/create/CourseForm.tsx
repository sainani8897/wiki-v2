/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { Steps, Divider, Stack, IconButton } from 'rsuite';
import PageContent from '@/components/PageContent';

import PageNextIcon from '@rsuite/icons/PageNext';
import PagePreviousIcon from '@rsuite/icons/PagePrevious';

import BasicForm from './Basic';
import TeamSettingsForm from './TeamSettingsForm';
import BusinessDetailForm from './BusinessDetailForm';
import BuilderForm from './BuilderForm';
import Completed from './Completed';

const forms = [BasicForm, BuilderForm, TeamSettingsForm, BusinessDetailForm, Completed];

const CourseForm = () => {
  const [step, setStep] = useState(0);
  const Form = forms[step];
  return (
    <PageContent>
      <Steps current={step}>
        <Steps.Item title="Course" />
        <Steps.Item title="Builder" />
        <Steps.Item title="Settings" />
        <Steps.Item title="Business Info" />
        <Steps.Item title="Completed" />
      </Steps>

      <Divider />
      <div className="wizard-form">
        <Form />

        <Divider />

        <Stack justifyContent="space-between">
          {step !== 0 && (
            <IconButton icon={<PagePreviousIcon />} onClick={() => setStep(Math.max(step - 1, 0))}>
              Back
            </IconButton>
          )}

          {step !== forms.length - 1 && (
            <IconButton
              icon={<PageNextIcon />}
              placement="right"
              appearance="primary"
              onClick={() => setStep(Math.min(step + 1, 4))}
            >
              Continue
            </IconButton>
          )}
        </Stack>
      </div>
    </PageContent>
  );
};

export default CourseForm;
