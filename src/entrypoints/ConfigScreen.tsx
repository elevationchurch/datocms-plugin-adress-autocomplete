import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, TextField } from 'datocms-react-ui';

export type ValidParameters = { mapsAPIKey: string };

export interface ConfigScreenProps {
  ctx: RenderConfigScreenCtx;
}

export default function ConfigScreen({ ctx }: ConfigScreenProps) {
  const parameters = ctx.plugin.attributes.parameters as ValidParameters;

  return (
    <Canvas ctx={ctx}>
      <TextField
        name='maps-api-key'
        label='Google Maps API Key'
        id='maps-api-key'
        value={parameters.mapsAPIKey}
        onChange={(newValue) => {
          ctx.updatePluginParameters({ mapsAPIKey: newValue });
          ctx.notice('API Key saved successfully!');
        }}
        required
      />
    </Canvas>
  );
}
