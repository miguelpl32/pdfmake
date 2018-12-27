import {isArray} from './helpers';

function typeName(bold, italics) {
	var type = 'normal';
	if (bold && italics) {
		type = 'bolditalics';
	} else if (bold) {
		type = 'bold';
	} else if (italics) {
		type = 'italics';
	}
	return type;
}

class FontProvider {
	constructor(fontDescriptors, pdfKitDoc) {
		this.fonts = {};
		this.pdfKitDoc = pdfKitDoc;
		this.fontCache = {};

		for (var font in fontDescriptors) {
			if (fontDescriptors.hasOwnProperty(font)) {
				var fontDef = fontDescriptors[font];

				this.fonts[font] = {
					normal: fontDef.normal,
					bold: fontDef.bold,
					italics: fontDef.italics,
					bolditalics: fontDef.bolditalics
				};
			}
		}
	}

	provideFont(familyName, bold, italics) {
		var type = typeName(bold, italics);
		if (!this.fonts[familyName] || !this.fonts[familyName][type]) {
			throw new Error(`Font '${familyName}' in style '${type}' is not defined in the font section of the document definition.`);
		}

		this.fontCache[familyName] = this.fontCache[familyName] || {};

		if (!this.fontCache[familyName][type]) {
			var def = this.fonts[familyName][type];
			if (!isArray(def)) {
				def = [def];
			}
			this.fontCache[familyName][type] = this.pdfKitDoc.font(...def)._font;
		}

		return this.fontCache[familyName][type];
	}
}

export default FontProvider;
