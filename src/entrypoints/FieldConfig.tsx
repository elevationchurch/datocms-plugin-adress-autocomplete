import { RenderManualFieldExtensionConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, FieldGroup, Form, SelectField } from 'datocms-react-ui';
import { useCallback, useState } from 'react';
import { languages } from '../lib/constants';

type PropTypes = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

type Parameters = {
  language: {
    label: string;
    value: string;
  };
};

export default function PluginConfig({ ctx }: PropTypes) {
  const [formValues, setFormValues] = useState<Partial<Parameters>>(
    ctx.parameters || {
      language: { label: 'English', value: 'en' },
    },
  );

  const setSourceFieldName = useCallback(
    (field: string, value: any) => {
      const newParameters = { ...formValues, [field]: value };
      setFormValues(newParameters);
      ctx.setParameters(newParameters);
    },
    [formValues, setFormValues, ctx],
  );

  return (
    <Canvas ctx={ctx}>
      <Form>
        <FieldGroup style={{ height: '175px' }}>
          <SelectField
            name='language'
            id='language'
            label='Language'
            hint='Select a language (optional)'
            value={formValues.language}
            selectInputProps={{
              options: languages.sort((a, b) => (a.label > b.label ? 1 : -1)),
              menuPlacement: 'top',
              isSearchable: true,
              maxMenuHeight: 150,
            }}
            required
            onChange={setSourceFieldName.bind(null, 'language')}
          />
        </FieldGroup>
      </Form>
    </Canvas>
  );
}
