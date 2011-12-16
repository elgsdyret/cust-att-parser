
describe('CAP.js', function() {
	describe('CAP', function(){

		it('uses default behaviour when no custom attribute parse methods defined', function(){
			// arrange
			var person = CAP(Backbone.Model.extend());
			var testPerson = new person();

			var resp = { name: 'Name' };

			// act
			var parsedAttributes = testPerson.parse(resp);

			// assert
			expect(parsedAttributes.name).toEqual('Name');
		});

		it('uses defined custom attribute parse method given by convention', function () {

			// arrange
			var model = CAP(Backbone.Model.extend({
				parseName: function (attrResp) { return attrResp['name'] + ' - new name' },
				parseCamelCaseName: function (attrResp) { return attrResp['camelCaseName'] + ' - new camelCaseName' }
			}));

			var resp = {
				name: 'old name',
				camelCaseName: 'old camelCaseName'
			};

			// act
			var instance = new model();
			var parsedAttributes = instance.parse(resp);

			// assert
			expect(parsedAttributes.name).toEqual('old name - new name');
			expect(parsedAttributes.camelCaseName).toEqual('old camelCaseName - new camelCaseName');
		});

		it('uses defined custom attribute parse method, but re-use other attributes', function(){
			// arrange
			var model = CAP(Backbone.Model.extend({
				parseName: function(attrResp){ return attrResp['name'] + ' name' }
			}));

			var resp = {
				id: 1,
				name: 'old name'
			};

			// act
			var instance = new model();
			var parsedAttributes = instance.parse(resp);

			// assert
			expect(parsedAttributes.id).toEqual(1);
			expect(parsedAttributes.name).toEqual('old name name');
		});

		it('uses multiple defined custom attribute parse methods, but re-use other attributes', function(){
			// arrange
			var model = CAP(Backbone.Model.extend({
				parseName: function(attrResp){ return attrResp['name'] + ' name' },
				parseNumber: function(attrResp){ return attrResp['number'] + 2 }
			}));

			var resp = {
				id: 1,
				name: 'old name',
				number: 42
			};

			// act
			var instance = new model();
			var parsedAttributes = instance.parse(resp);

			// assert
			expect(parsedAttributes.id).toEqual(1);
			expect(parsedAttributes.name).toEqual('old name name');
			expect(parsedAttributes.number).toEqual(44);
		});

		it('uses old parse method and add custom attribute parse methods results', function(){
			// arrange
			var model = CAP(Backbone.Model.extend({
				parse: function(resp){
					resp['number'] = resp['number'] +1;
					return resp;
				},
				parseNumber: function(attrResp){ return attrResp['number'] + 2 }
			}));

			var resp = {								
				number: 42
			};

			// act
			var instance = new model();
			var parsedAttributes = instance.parse(resp);

			// assert
			expect(parsedAttributes.number).toEqual(45);
		});

		it('has proper this inside custom parse method', function(){
			// arrange
			var model = CAP(Backbone.Model.extend({
				someOtherMethod: function(){ return this.get('number'); },
				parseNumber: function(attrResp){ return this.someOtherMethod() + 2 }
			}));

			var resp = {
				number: 42
			};

			// act
			var instance = new model({number: 4});
			var parsedAttributes = instance.parse(resp);

			// assert
			expect(parsedAttributes.number).toEqual(6);
		});

		it('updates state correctly - PARSE SHOULD NOT UPDATE STATE', function(){
			// arrange
			var model = CAP(Backbone.Model.extend({
				parseNumber: function(attrResp){ this.set({number: 2})}
			}));

			var resp = {
				number: 42
			};

			// act
			var instance = new model({number: 4});
			var parsedAttributes = instance.parse(resp);

			// assert
			expect(parsedAttributes.number).toBeUndefined();
			expect(instance.get('number')).toBe(2);
		});


		describe('ajax result from server is handled', function(){
			beforeEach(function(){
				jasmine.Ajax.useMock();
			});
			it('fetches data and runs it through custom parsers', function(){

				// arrange
				var successResponse = {
					status: 200,
					responseText: '{"name": "muffin", "age": 4}'
				};

				var Dog = CAP(Backbone.Model.extend({
					url: '/dogs/',
					parseName: function(resp){
						return 'ms ' + resp['name'];
					}
				}));
				var bestDog = new Dog();

				// act
				bestDog.fetch();

				mostRecentAjaxRequest().response(successResponse);

				// assert
				expect(bestDog.get('name')).toEqual('ms muffin');
			});
		});
	});
});