import React, {
  FunctionComponent,
  createRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
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
import fillInAddress from '../../lib/fillInAddress';

interface AddressInputProps {
  ctx: RenderFieldExtensionCtx;
}

const initialAddress = {
  administrative_area_level_1: '',
  formatted_address: '',
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
  // Initial value doesn't change, which is why we put it in a ref
  const initialValue = useRef(
    JSON.parse(ctx.formValues[ctx.fieldPath] as string),
  );

  // URL to Google's library
  const [src, setSrc] = useState('');
  const [address, setAddress] = useState<{ [key: string]: any }>(
    initialValue.current || initialAddress,
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

    const listener = autocomplete.current.addListener('place_changed', () => {
      fillInAddress(ctx, autocomplete, setAddress);
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
      }&libraries=places&language=${(ctx.parameters.language as any).value}`,
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
              defaultValue={address.formatted_address || ''}
              onChange={(e) => {
                if (!e) {
                  setAddress(initialAddress);
                  saveFieldValue(ctx, {});
                }
              }}
            />
          </FieldWrapper>
        </FieldGroup>
        <FieldGroup className={styles.addressComponents}>
          <FieldWrapper id='venue-name-field' label='Venue Name'>
            <TextInput disabled value={address['name']} />
          </FieldWrapper>
          <FieldWrapper id='street-address-field' label='Street Address'>
            <TextInput
              disabled
              value={
                address.street_number
                  ? `${address.street_number} ${address.route}`
                  : ''
              }
            />
          </FieldWrapper>
          <FieldWrapper
            id='subpremise-field'
            label='Subpremise'
            hint='ex: apt or ste number'
          >
            <TextInput disabled value={address['subpremise'] || ''} />
          </FieldWrapper>
          <FieldWrapper id='city-field' label='City'>
            <TextInput disabled id='city' value={address['locality'] || ''} />
          </FieldWrapper>
          <FieldWrapper id='state-field' label='State'>
            <TextInput
              disabled
              value={address['administrative_area_level_1'] || ''}
            />
          </FieldWrapper>
          <FieldWrapper id='postal-code-field' label='Postal Code'>
            <TextInput
              disabled
              value={
                address.postal_code
                  ? `${address.postal_code}${
                      address.postal_code_suffix
                        ? `-${address.postal_code_suffix}`
                        : ''
                    }`
                  : ''
              }
            />
          </FieldWrapper>
          <FieldWrapper id='country-field' label='Country'>
            <TextInput disabled value={address['country'] || ''} />
          </FieldWrapper>
        </FieldGroup>
        <FieldGroup className={styles.coordinatesWrapper}>
          <FieldWrapper id='latitude-field' label='Latitude'>
            <TextInput
              disabled
              value={address.coordinates ? address.coordinates.lat : ''}
            />
          </FieldWrapper>
          <FieldWrapper id='longitude-field' label='Longitude'>
            <TextInput
              disabled
              value={address.coordinates ? address.coordinates.lng : ''}
            />
          </FieldWrapper>
        </FieldGroup>
        <Button type='button' onClick={() => setAddress(initialValue.current)}>
          Reset to Initial Value
        </Button>
      </Form>
    </Canvas>
  );
};

export default AddressInput;
