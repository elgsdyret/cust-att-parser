
/*
The purpose of Custom Attribute Parser (CAP) is to enable easy custom parsing of a specific attribute on a Backbone model.

CAP identifies custom parser method based on a simple naming convention - ie. parse<Something>

If any custom parser are found CAP wraps the parse method on the model. When parse is called CAP will call the custom parser
for a given attribute if the attribute if present in the response.

A parser is linked to an attribute by a simple naming convention: parse<AttributeName>, ie. 'parseName' is the parser for the
'name' attribute.

CAP ensures that the parsed attribute is placed at the given attribute in the original parse result. The custom parser gets the
resp as input, and is responsible for grabbing the pieces needed from that, and should return the custom parsed result.
*/

this.CAP = function (model) {
	// retrieve all custom parsers ie. all method name parse<Something>
	var filterFunction = function (functionName) {
		return functionName.length > 5 && functionName.substring(0, 5) == 'parse';
	};
	var customParsers = _(model).functions().filter(filterFunction);

	// retrieve the attr name from the custom parser
	var attrNameFromMethodName = function (methodName) {
		return methodName.substring(5).replace(/^\w/, function ($0) { return $0.toLowerCase(); });
	};

	// run all the custom parsers
	var runCustomParsers = function (baseParse, customParsers, resp) {
		var parsed = baseParse(resp);
		var setCustomParsedAttribute = function (customParserName) {
			var attrName = attrNameFromMethodName(customParserName);
			// only run the parse if we actually need to, ie. if the specific attr is present
			parsed[attrName] != null && (parsed[attrName] = model[customParserName](resp));
		};
		_(customParsers).each(setCustomParsedAttribute)
		return parsed;
	};

	// wrap the original parse method with our runCustomParsers
	var wrapParse = function (model, parsers) {
		// wrap parsers in an array, since bind will think it is an arguments array
		model.parse = _(model.parse).wrap(runCustomParsers).bind(this, [parsers]);
	};

	// wrap, but only if we need to
	if (customParsers.length > 0)
		wrapParse(model, customParsers);

	return model;
};