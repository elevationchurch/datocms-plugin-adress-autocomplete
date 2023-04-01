import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import saveFieldValue from './saveFieldValue';
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';

const fillInAddress = (
  ctx: RenderFieldExtensionCtx,
  autocomplete: MutableRefObject<google.maps.places.Autocomplete | undefined>,
  setAddress: Dispatch<
    SetStateAction<{
      [key: string]: any;
    }>
  >,
) => {
  if (!autocomplete.current) return;

  const place = autocomplete.current.getPlace();
  if (!place || !place.address_components) return;

  const addressComponents: { [key: string]: any } = {};

  for (let component of place.address_components) {
    addressComponents[component.types[0]] = component.short_name;
  }

  addressComponents.name = place.name || '';
  addressComponents.formatted_address = place.formatted_address;

  addressComponents.coordinates = {};
  addressComponents.coordinates.lat = place.geometry?.location?.lat();
  addressComponents.coordinates.lng = place.geometry?.location?.lng();

  saveFieldValue(ctx, addressComponents);

  setAddress(addressComponents as any);
};

export default fillInAddress;
