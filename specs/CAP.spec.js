
describe('src/shared/utils/CAP.js', function() {
	describe('CAP', function(){
		it('uses default behaviour when no custom attribute parse methods defined', function(){
			// arrange
			var person = Backbone.Model.extend();
			var testPerson = new person();

			var resp = { name: 'Name' };

			// act
			var zTestPerson = CAP(testPerson);
			var parsedAttributes = zTestPerson.parse(resp);

			// assert
			expect(parsedAttributes.name).toEqual('Name');
		});


		it('uses defined custom attribute parse method given by convention', function () {
			// arrange
			var model = {
				parse: function (resp) { return resp; },
				parseName: function (attrResp) { return attrResp['name'] + ' - new name' },
				parseCamelCaseName: function (attrResp) { return attrResp['camelCaseName'] + ' - new camelCaseName' }
			};

			var resp = {
				name: 'old name',
				camelCaseName: 'old camelCaseName'
			};

			// act
			var zModel = CAP(model);
			var parsedAttributes = zModel.parse(resp);

			// assert
			expect(parsedAttributes.name).toEqual('old name - new name');
			expect(parsedAttributes.camelCaseName).toEqual('old camelCaseName - new camelCaseName');
		});
		
		it('uses defined custom attribute parse method, but re-use other attributes', function(){
			// arrange
			var model = {
				parse: function(resp){ return resp;	},
				parseName: function(attrResp){ return attrResp['name'] + ' name' }
			};

			var resp = {
				id: 1,
				name: 'old name'
			};

			// act
			var zModel = CAP(model);
			var parsedAttributes = zModel.parse(resp);

			// assert
			expect(parsedAttributes.id).toEqual(1);
			expect(parsedAttributes.name).toEqual('old name name');
		});

		
		it('uses multiple defined custom attribute parse methods, but re-use other attributes', function(){
			// arrange
			var model = {
				parse: function(resp){ return resp;	},
				parseName: function(attrResp){ console.log(attrResp); return attrResp['name'] + ' name' },
				parseNumber: function(attrResp){ return attrResp['number'] + 2 }
			};

			var resp = {
				id: 1,
				name: 'old name',
				number: 42
			};

			// act
			var zModel = CAP(model);
			var parsedAttributes = zModel.parse(resp);

			// assert
			expect(parsedAttributes.id).toEqual(1);
			expect(parsedAttributes.name).toEqual('old name name');
			expect(parsedAttributes.number).toEqual(44);
		});

		it('uses defined attributes parse methods on backbone model, but re-use other attributes', function(){
			// arrange
			var person = Backbone.Model.extend({
				parseName: function(resp){
					return 'custom' + resp['name'];
				}
			});
			var testPerson = new person();

			var resp = { name: 'Name' };

			// act
			var zTestPerson = CAP(testPerson);
			var parsedAttributes = zTestPerson.parse(resp);

			// assert
			expect(parsedAttributes.name).toEqual('customName');
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

				var Dog = Backbone.Model.extend({
					url: '/dogs/',
					parseName: function(resp){
						return 'ms ' + resp['name'];
					}
				});
				var bestDog = CAP(new Dog());

				// act
				bestDog.fetch();

				mostRecentAjaxRequest().response(successResponse);

				// assert
				expect(bestDog.get('name')).toEqual('ms muffin');
			});
		});
	});
});