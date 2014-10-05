# chain-check

## API

#### GET /api/devices/

Returns array of devices with keys: `_id`,  `check`


#### GET /api/devices/:deviceId

Returns a device with keys: `_id`, `check`, `audio`

`audio` is an array of audio with keys: `_id`, `timestamp`, `deviceId`

#### POST /api/devices/:deviceId

Creates device if no device with id `deviceId` is found

Creates audio using `file` field for file, and `timestamp` field for timestamp

#### PUT /api/devices/:deviceId

Allows you to set `check` value to true or false by setting check field on body

#### GET /api/audio/:audioId

Returns received file with mime-type `audio/x-wav`
