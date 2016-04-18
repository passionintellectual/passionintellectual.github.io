/**
 * @license
 * Copyright (c) 2015 MediaMath Inc. All rights reserved.
 * This code may only be used under the BSD style license found at http://mediamath.github.io/strand/LICENSE.txt

 */
(function (scope) {

	scope.filter =   Polymer({
		is: 'mm-filter',
		ready: function () {
			this._switchMode();
		},
		_switchMode:function(){
			var isSearchConfigEmpty = (!this.searchConfig || this.searchConfig.length == 0);
			if( !this._isAdvance()){
				this.searchConfig = isSearchConfigEmpty ? [
					{ 'searchValue': this._simpleSearchValue || '',
						'column': 'ALL',//'first_name',
						'comparison': 'contains',
						'logicalOperator': "AND",

					},
				]:this.searchConfig;
				this.searchConfig[0].column = 'ALL';
			}else{

				this.searchConfig = isSearchConfigEmpty ?  [
					{ 'searchValue': '',
						'column': this.columns[0].value,
						'comparison': 'contains',
						'logicalOperator': "AND"  },
				]:this.searchConfig;

			}
		},
		_isAdvance:function (a) {
			if(a == 'advance'){
				return true;
			}else{
				return false;
			}
		},
		_toSelectLogicalOperation: function (index, item) {
			if (index === 0) { item.logicalOperator ='AND'; item.index = 0; item.level = 0; item.parent = null; item.id = 0;}
			return index != 0;
		},
		_getLeftMarginPerLevel:function (item) {
			var px = item.level * 100;
			return px+'px';
		},
		_addConfig:function (e) {
			if(this.searchConfig){
				var isRootAddButton = (!e.model || !e.model.item);
				var currentLevel = !isRootAddButton ? (e.model.item.level || 0):null;

				var index = !isRootAddButton?e.model.index + 1 :this.searchConfig.length;
				index = index || 0;

				this.splice('searchConfig', index, 0, {
					comparison:'contains',
					logicalOperator:'AND',
					level:(currentLevel == null ? -1:currentLevel)+ 1,
					parentLevel:currentLevel,
					id:index,
					parent:isRootAddButton?null:e.model.item.id
				});

				// this.push('searchConfig', )
			}
		},
		_deleteConfig:function (e) {
			var model = e.model;
			this.splice('searchConfig', model.index, 1);
		},
		 
		_comparisonChanged:function (e) {
			var model = e.model;
			//All not allowed for these comparisons.
			if(['LessThan', 'GreaterThan'].indexOf(e.detail.value) > -1){
				if(model.item.column == 'ALL') {
					model.set('item.column', this.columns[1].value);
				}
				model.set('item.showInclusive', true);
			}else{
				model.set('item.showInclusive', false);
			}
			model.set('item.comparison', e.detail.value);
		},
		_conditionChanged:function (e) {
			var model = e.model;
			model.set('item.logicalOperator', e.detail.value);
		},
		_selectColumnChanged:function (e) {
			var model = e.model;
			model.set('item.column', e.detail.value);
		},
		_populateColumns:function () {
			this.columns = this.columns || [{name:'ALL', value:'ALL'}];
			if(this.data && this.data.length>0) {
				var cols = Object.keys(this.data[0]);
				for (var i = 0; i < cols.length; i++) {
					var col = cols[i];
					if(col == 'selected'){
						continue;
					}
					var colName = col.replace('_',' ');
				// colName = colName.charAt(0).toUpperCase() + colName.slice(1);
					this.columns.push({
						value: col,
						name:  colName.toUpperCase()
					})
				}
			}
		},
		observers: [
			'_dataChanged(data.*)',
			'_searchConfigChanged(searchConfig.*)',
			'_simpleSearchValueChanged(_simpleSearchValue)',


		],
		_simpleSearchValueChanged:function () {
			this.searchConfig[0].searchValue = this._simpleSearchValue ;

			this._searchConfigChanged();
		},
		_dataChanged:function () {
			//datais Changed : this.data
			this._populateColumns();

		},
		_searchConfigChanged:function() {
			//searchconfig changed
			this.searchString  = JSON.stringify(this.searchConfig);
			this._simpleSearchValue = this._simpleSearchValue||'';
			if(this.autoSearch &&
				(this.searchMode == 'simple' && (this._simpleSearchValue.length > this.minLength || !this._simpleSearchValue )
				|| (this.searchMode == 'advance'))){

				this.debounce('doSearch', function () {
					this.fire('search', {data:this});
				}.bind(this), this.debounceDelay || 0);

			}
		},
		_modeChanged:function () {
			this._switchMode();
		},
		properties: {
			data: {
				type: Array,
				value: [],
				notify: true
			},
			searchMode:{
				type:String,
				value:'simple',
				notify:true,
				observer:'_modeChanged',

			},
			searchConfig:{
				type:Object,
				value:[],
				notify:true
			},
			autoSearch:{
				type:Boolean,
				value:true,
				notify:true
			},
			minLength:{
				type:Number,
				value:0,
				notify:true
			},
			debounceDelay:{
				type:Number,
				value:0,
				notify:true
			}
		},
		behaviors: [
			StrandTraits.Resolvable
		],
	});
})(window.Strand = window.Strand || {});