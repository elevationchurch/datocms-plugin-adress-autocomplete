import {
  RenderConfigScreenCtx,
  RenderManualFieldExtensionConfigScreenCtx,
  connect,
} from 'datocms-plugin-sdk';
import 'datocms-react-ui/styles.css';
import AddressInput from './entrypoints/AddressInput';
import { render } from './utils/render';
import React from 'react';
import ConfigScreen from './entrypoints/ConfigScreen';
import PluginConfig from './entrypoints/FieldConfig';
import ReactDOM from 'react-dom';

connect({
  renderConfigScreen: (ctx: RenderConfigScreenCtx) => {
    render(
      <React.StrictMode>
        <ConfigScreen ctx={ctx} />
      </React.StrictMode>,
    );
  },
  manualFieldExtensions: () => [
    {
      id: 'address',
      name: 'Address',
      type: 'editor',
      fieldTypes: 'all',
      configurable: true,
    },
  ],
  renderManualFieldExtensionConfigScreen: (
    _fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx,
  ) => {
    ReactDOM.render(
      <React.StrictMode>
        <PluginConfig ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
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
