
// Collection Sub Parsing
var CSP = function(collection){
	var me = collection.prototype;
	var existingParse = me.parse;

	// TODO: how to make CSP work?

	// It will never work with the prototype since some parsers might need the state of the object
	// CSP can never give the state....

	return collection.extend({
		parse: function(resp, xhr){
			existingParse = existingParse.bind(me);

			// To avoid problems with state instantiate instead
			var modelInstance = new me.model();

			// TODO: will this cause problems if parse updates state?

			var parsedResp = [];
			var runModelParsing = function(modelResp){
				parsedResp.push(modelInstance.parse(modelResp));
			};

			_(resp).each(runModelParsing);
			return parsedResp;
		}
	});
};