# Menstrual Hygiene Products @ NYU

## Overview

After a petition in fall 2016 lead by the all-university group Students for Sexual Respect, NYU began providing free menstrual hygiene products in certain restrooms around the Washington Square and Brooklyn campuses. The availability of these products began as a pilot program on October 2016 and the program started running at full capacity in February 2017.

Nevertheless, a few limitations of the current implementation have emerged. 

1. Lack of An Accurate Listing of Supply Locations
   The NYU Menstrual Hygiene Products web page on the Student Health Center website does not list consistent information about where free menstrual hygiene products can be found on campus. 
  
2. Inconsistent availability / Lagging refill of the products
   According to Chief of Staff of Student Affairs Elizabeth Kuzina, stock of menstrual hygiene products in all NYU restrooms is checked by Facilities and Operations custodial staff on their regular cleaning cycle, which rotates several times per day. But the reality is reporting empty dispensaries is an added task to existing work duties, and dispensaries are not always refilled immediately.


## Data Model

The application will store Admins, Locations, Reports

* admins can manage the reports and update the information about the menstrual hygiene products at each location
* each report provides information about the supply status at each location (via reference)
* each location includes information about the particular service, price, and current supply

An Example Admin:

```javascript
{
  adminname: " student health center",
  hash: // a password hash,
}
```

An Example Report:

```javascript
{
  campus: // WSQ or BRK
  location: // a reference to a location object
  message: "Hi there is no more tampon available at Bobst SOS", 
  item: // the product in shortage
  createdAt: // timestamp
}
```

An Example Location:

```javascript
{
  name: // the location name
  code: // a shortened version
  lat: // the latitude (x coordinator)
  lng: // the longitude (y coordinator)
  type: // either 'take only what you need for now'（immediate) or 'take supplies for later' (future)
  campus: // WSQ or BRK
  items: [
    { name: "tampons", shortage: false, free: false},
    { name: "pads", shortage: false, free: false},
  ],
}
```
