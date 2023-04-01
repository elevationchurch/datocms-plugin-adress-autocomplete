import { RenderConfigScreenCtx, connect } from 'datocms-plugin-sdk';
import 'datocms-react-ui/styles.css';
import AddressInput from './entrypoints/AddressInput';
import { render } from './utils/render';
import React from 'react';
import ConfigScreen from './entrypoints/ConfigScreen';

connect({
  renderConfigScreen: (ctx: RenderConfigScreenCtx) => {
    render(
      <React.StrictMode>
        <ConfigScreen ctx={ctx} />
      </React.StrictMode>,
    );
  },
  manualFieldExtensions: () => {
    return [
      {
        id: 'address',
        name: 'Address',
        type: 'editor',
        fieldTypes: 'all',
        configurable: false,
      },
    ];
  },
  // overrideFieldExtensions: (field) => {
  //   if (field.attributes.api_key === 'address') {
  //     return {
  //       editor: {
  //         id: 'address',
  //       },
  //     };
  //   }
  // },
  renderFieldExtension: (fieldExtensionId, ctx) => {
    switch (fieldExtensionId) {
      case 'address':
        return render(
          <React.StrictMode>
            <AddressInput ctx={ctx} />
          </React.StrictMode>,
        );
    }
  },
});
