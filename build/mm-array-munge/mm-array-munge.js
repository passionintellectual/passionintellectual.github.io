/**
 * @license
 * Copyright (c) 2015 MediaMath Inc. All rights reserved.
 * This code may only be used under the BSD style license found at http://mediamath.github.io/strand/LICENSE.txt

*/
(function (scope) {

	scope.ArrayMunge = Polymer({
		is: "mm-array-munge",

		behaviors: [
			StrandTraits.Resolvable,
			StrandTraits.Refable
		],

		properties: {
			_parsedRules:{
				type:Array,
				value: function() { return []; }
			},
			input:{
				type:Array,
				notify:true
			},
			output:{
				type:Array,
				notify:true
			},
			rules:{
				type:String,
				value:"",
				observer:"_parseRules"
			},
			highlight:{
				type:String,
				value:"",
				observer:"_highlightChanged"
			}
		},

		observers:['_handleInputUpdate(input.*, _parsedRules)'],

		_handleInputUpdate: function() {
			if (this.input && this.input.length) {
				var o = this.input.map(function(i) {
					var o = {};
					this._parsedRules.forEach(function(rule) {
						var val = rule.from === '.' ? i : i[rule.from];
						if (rule.to !== '.') {
							o[rule.to] = val;
						} else {
							o = val;
						}
					});
					if (typeof o !== 'string' && this.highlight) o.highlight = this.highlight
					return o;
				},this);
				this.set('output', o);
			}
		},

		_parseRules: function() {
			this._parsedRules = this.rules.split(",").map(function(rule) {
				var parsed = rule.split("->");
				if (parsed.length === 2) {
					return {
						from:parsed[0],
						to:parsed[1]
					}
				}
			}, this).filter(function(o) { return !!o });
		},

		_highlightChanged: function() {
			// if (this.input && this.inpu.length) {
			// 	this.set('output', this.output.map(function(o) {
			// 		o.highlight = this.highlight;
			// 	}));
			// } else {
			// 	this._handleInputUpdate();
			// 	this.set('output', this.output.map(function(o) {
			// 		o.highlight = this.highlight;
			// 	}));
			// }
		}

	});

})(window.Strand = window.Strand || {});
