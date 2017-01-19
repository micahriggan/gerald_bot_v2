'use strict';

const path = require('path');
let defaultSettings = require('../setup/core/settings.json');
let customSettings = require('../setup/custom/settings.json');
const fs = require('fs');

class Settings {

	/**
	 * Returns a setting with the passed-in key,
	 * from the specified file.
	 * @param  {String} fileName
	 * @param  {String} key
	 * @return {any}
	 */
	static getSetting( fileName, key ) {
		fileName = path.basename( fileName, '.js' );

		// Check for the setting in custom settings first
		if ( customSettings[ fileName ] && customSettings[ fileName ][ key ] !== undefined ) {
			return customSettings[ fileName ][ key ];
		}

		// If a setting was not found in the custom settings
		// then search in the core settings
		if ( defaultSettings[ fileName ] && defaultSettings[ fileName ][ key ] !== undefined ) {
			return defaultSettings[ fileName ][ key ];
		}

		return null;
	}

	static setSetting(fileName, key, _newValue) {
		fileName = path.basename( fileName, '.js' );

		// Check for the setting in custom settings first
		if ( customSettings[ fileName ] && customSettings[ fileName ][ key ] !== undefined ) {
			customSettings[fileName][key] = _newValue;
			fs.writeFile("setup/custom/settings.json", JSON.stringify(customSettings, null, '\t'), function(err) {
	    if(err) {
	        return console.log(err);
	    }});
		}
		else {
			defaultSettings[fileName][key] = _newValue;
			fs.writeFile("setup/core/settings.json", JSON.stringify(defaultSettings, null, '\t'), function(err) {
	    if(err) {
	        return console.log(err);
	    }});
		}

    console.log("The file was saved!");
	}

	static getSettingFile( fileName ) {
		fileName = path.basename( fileName, '.js' );

		// Check for the setting in settings.json first
		if ( customSettings[ fileName ] ) {
			return customSettings[ fileName ];
		}

		// If a setting was not found in the settings.json,
		// then search in the defaultSettings
		if ( defaultSettings[ fileName ] ) {
			return defaultSettings[ fileName ];
		}

		return null;
	}
}

module.exports = Settings;
