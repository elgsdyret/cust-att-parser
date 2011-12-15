

describe('CSP.js', function() {
	describe('CSP', function(){
		it ('calls parse for each sub element', function(){
			var model = Backbone.Model.extend({
				parse: function(resp) {
					resp['a']++;
					return resp;
				}
			});

			var collection = CSP(Backbone.Collection.extend({
				model: model
			}));

			var instanceCollection = new collection();
			
			var result = instanceCollection.parse([{ a: 1}, { a: 2}]);

			expect(result[0].a).toBe(2);
			expect(result[1].a).toBe(3);
		});

		it ('calls parse for each sub element on inherited model', function(){
			var baseModel = Backbone.Model.extend({
			});

			var model = baseModel.extend({
				parse: function(resp) {
					resp['a']++;
					return resp;
				}
			});

			var collection = CSP(Backbone.Collection.extend({
				model: model
			}));

			var instanceCollection = new collection();

			var result = instanceCollection.parse([{ a: 1}, { a: 2}]);

			expect(result[0].a).toBe(2);
			expect(result[1].a).toBe(3);
		});

		it ('ends up using custom attribute parsers on a CAP model', function(){
			var model = CAP(Backbone.Model.extend({
				parseAbc: function(resp) {
					return ++resp['abc'];
				}
			}));

			var collection = CSP(Backbone.Collection.extend({
				model: model
			}));

			var instanceCollection = new collection();

			var result = instanceCollection.parse([{ abc: 1}, { abc: 2}]);

			expect(result[0].abc).toBe(2);
			expect(result[1].abc).toBe(3);
		});

		it ('ends up using multiple custom attribute parsers on a CAP model', function(){
			var model = CAP(Backbone.Model.extend({
				parseAbc: function(resp) {
					return ++resp['abc'];
				},
				parseDef: function(resp) {
					return ++resp['def'];
				}
			}));

			var collection = CSP(Backbone.Collection.extend({
				model: model
			}));

			var instanceCollection = new collection();

			var result = instanceCollection.parse([{ abc: 1, def: 2}, { abc: 2, def: 3}]);

			expect(result[0].abc).toBe(2);
			expect(result[0].def).toBe(3);
			expect(result[1].abc).toBe(3);
			expect(result[1].def).toBe(4);
		});
	});
});
