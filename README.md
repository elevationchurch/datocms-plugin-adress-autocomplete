# DatoCMS Address Autocomplete

<img width="822" alt="image" src="https://user-images.githubusercontent.com/127895784/229308757-078ca542-ff04-4e2f-a68f-d631c9b5c108.png">

This plugin is a React-based implementation of Google's [Address Autocomplete](https://developers.google.com/maps/documentation/javascript/place-autocomplete) API, for [DatoCMS](https://www.datocms.com/).

Results will be saved as a JSON object, with granular fields that allow you to query for data such as city, state, and geocoordinates. For example:

```json
{
  "street_number": "11701",
  "route": "Elevation Pt Dr",
  "neighborhood": "Ballantyne",
  "locality": "Charlotte",
  "administrative_area_level_2": "Mecklenburg County",
  "administrative_area_level_1": "NC",
  "country": "US",
  "postal_code": "28277",
  "name": "Elevation Church - Ballantyne",
  "formatted_address": "11701 Elevation Pt Dr, Charlotte, NC 28277, USA",
  "coordinates": {
    "lat": 35.02993079999999,
    "lng": -80.8557278
  }
}
```

## But, why?

There are several reasons why we created this plugin:

### 1. Data integrity

Content creators were typing in addresses in plain text fields, which of course led to mistakes.

### 2. Frontend capabilities

We wanted to be able to link to Google and Apple Maps on the frontend, but couldn't reliably do so without the possibility of linking to an incorrect address.

There's also the ability to display any part of the address, without being hacky (i.e., parsing a full address and trying to extract city, state, etc).

### 3. Sorting by geocoordinates

We'd like to present a user with events closest to them. Now, we can trust that the geocoordinates stored in our DB directly point to the location the event is happening in, rather than looking them up by address on the frontend.

Geocoordinates are also passed directly to our search engine, meaning that _it_ does all the sorting for us. Win-win.

### 4. User experience

Our content creators can quickly and confidently enter addresses. No more copy-paste-verify.

## Prerequisites

First off, you'll need to obtain an [API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) from Google Cloud. This README won't cover those steps, but here's a friendly reminder that you will need to enable to following Google Cloud services in order for it to work:

- Maps JavaScript API
- Places API

## Installation

Here's a link to this plugin's page on the [DatoCMS Marketplace](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-address-autocomplete?s=address), in case you are reading this somewhere else. Just click on "Install this plugin!" from teh Marketplace and select the appropriate DatoCMS project to associate it to.

## Configuration

There is only one (required) setting, and that's your Google Cloud API Key.

<img width="400" alt="image" src="https://user-images.githubusercontent.com/127895784/229323365-857d7842-20d7-463b-99a5-04e0f19da751.png">

To use this plugin, create a JSON field, and under **Presentation**, change the **Field editor** property to `Address`.

<img width="400" alt="image" src="https://user-images.githubusercontent.com/127895784/229323386-d5e3f98b-4bce-4cf1-9458-547d60a0b46f.png">

## Internationalization

You can also choose to receive results in a language other than English at the field-level. Please consult the list of [possible languages](https://developers.google.com/maps/faq#languagesupport), provided by Google Maps.

When adding or editing the field in your model, visit the **Presentation** tab and use the dropdown menu to select a different value for the language. You will now see results in a different language based on what Google Maps provides.

<img width="350" alt="Screenshot of field configuration screen" src="https://user-images.githubusercontent.com/127895784/233721614-5684fec5-2ce6-4436-bd03-ae42b7393fba.png">

