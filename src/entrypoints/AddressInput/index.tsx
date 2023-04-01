import React, {
  FunctionComponent,
  createRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Canvas,
  FieldGroup,
  FieldWrapper,
  Form,
  TextInput,
} from 'datocms-react-ui';
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { useScript } from '@ulises-codes/react-hooks';
import { ValidParameters } from '../ConfigScreen';
import styles from './AddressInput.module.css';
import saveFieldValue from '../../lib/saveFieldValue';

interface AddressInputProps {
  ctx: RenderFieldExtensionCtx;
}

const initialAddress = {
  administrative_area_level_1: '',
  street_number: '',
  route: '',
  locality: '',
  postal_code: '',
  postal_code_suffix: '',
  subpremise: '',
  country: '',
  name: '',
  coordinates: {
    lat: '',
    lng: '',
  },
};

const AddressInput: FunctionComponent<AddressInputProps> = ({ ctx }) => {
  const [src, setSrc] = useState('');
  const initialValue = useRef(
    JSON.parse(ctx.formValues[ctx.fieldPath] as string),
  );

  const [address, setAddress] = useState<{ [key: string]: any }>(
    initialValue.current,
  );

  const inputRef = createRef<HTMLInputElement>();

  const autocomplete = useRef<google.maps.places.Autocomplete>();
  const geolocateRef = useRef<() => void>();

  const status = useScript({ src });

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    if (!autocomplete.current) {
      autocomplete.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['geocode', 'establishment'],
          fields: [
            'address_component',
            'geometry',
            'name',
            'formatted_address',
          ],
        },
      );
    }

    const fillInAddress = () => {
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

    const listener = autocomplete.current.addListener('place_changed', () => {
      fillInAddress();
    });

    return () => google.maps.event.removeListener(listener);
  }, [status, inputRef, address, ctx]);

  useEffect(() => {
    if (!autocomplete.current || !!geolocateRef.current) return;

    geolocateRef.current = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const circle = new window.google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy,
          });

          autocomplete.current?.setBounds(circle.getBounds()!);
        });
      }
    };
  });

  function loadLibOnFocus() {
    if (typeof window !== 'undefined' && !!window.google) return;

    setSrc(
      `https://maps.googleapis.com/maps/api/js?key=${
        (ctx.plugin.attributes.parameters as ValidParameters).mapsAPIKey
      }&libraries=places`,
    );
  }

  return (
    <Canvas ctx={ctx}>
      <Form>
        <FieldGroup>
          <FieldWrapper
            id='address-entry-field'
            label='Address Lookup'
            hint='Start typing an address or venue name...'
          >
            <TextInput
              inputRef={inputRef}
              onFocus={loadLibOnFocus}
              id='address-entry'
              defaultValue={address['formatted_address'] || ''}
              onChange={(e) => {
                if (!e) {
                  setAddress(initialAddress);
                  saveFieldValue(ctx, '');
                }
              }}
            />
          </FieldWrapper>
        </FieldGroup>
        <FieldGroup className={styles.addressComponents}>
          <FieldWrapper id='venue-name-field' label='Venue Name'>
            <TextInput
              disabled
              id='venue-name'
              labelText='Venue Name'
              value={address['name']}
            />
          </FieldWrapper>
          <FieldWrapper id='street-address-field' label='Street Address'>
            <TextInput
              disabled
              id='street-address'
              labelText='Street Address'
              value={`${address['street_number']} ${address['route']}`}
            />
          </FieldWrapper>
          <FieldWrapper
            id='subpremise-field'
            label='Subpremise'
            hint='ex: apt or ste number'
          >
            <TextInput
              disabled
              id='subpremise'
              labelText='Sub-premise'
              value={address['subpremise'] || ''}
            />
          </FieldWrapper>
          <FieldWrapper id='city-field' label='City'>
            <TextInput
              disabled
              id='city'
              name='city'
              labelText='City'
              value={address['locality']}
            />
          </FieldWrapper>
          <FieldWrapper id='state-field' label='State'>
            <TextInput
              disabled
              id='state'
              name='state'
              labelText='State'
              value={address['administrative_area_level_1']}
            />
          </FieldWrapper>
          <FieldWrapper id='postal-code-field' label='Postal Code'>
            <TextInput
              disabled
              id='postal-code'
              name='postal-code'
              value={`${address['postal_code']}${
                address['postal_code_suffix']
                  ? `-${address['postal_code_suffix']}`
                  : ''
              }`}
            />
          </FieldWrapper>
          <FieldWrapper id='country-field' label='Country'>
            <TextInput
              disabled
              id='country'
              name='country'
              value={address['country']}
            />
          </FieldWrapper>
        </FieldGroup>
        <FieldGroup className={styles.coordinatesWrapper}>
          <FieldWrapper id='latitude-field' label='Latitude'>
            <TextInput
              disabled
              id='latitude'
              name='latitude'
              value={address.coordinates.lat}
            />
          </FieldWrapper>
          <FieldWrapper id='longitude-field' label='Longitude'>
            <TextInput
              disabled
              id='longitude'
              name='longitude'
              value={address.coordinates.lng}
            />
          </FieldWrapper>
        </FieldGroup>
      </Form>
    </Canvas>
  );
};

export default AddressInput;
