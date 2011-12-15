
// Collection Sub Parsing
var CSP = function(collection){
	var me = collection.prototype;
	var existingParse = me.parse;

	return collection.extend({
		parse: function(resp, xhr){
			existingParse = existingParse.bind(me);
			var modelParse = me.model.prototype.parse;
			var parsedResp = [];
			var runModelParsing = function(modelResp){
				parsedResp.push(modelParse(modelResp));
			};

			_(resp).each(runModelParsing);
			return parsedResp;
		}
	});
};