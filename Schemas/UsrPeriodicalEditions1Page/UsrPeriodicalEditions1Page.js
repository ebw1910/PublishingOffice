define("UsrPeriodicalEditions1Page", ["ProcessModuleUtilities", "UsrPeriodicalEditionsConstants"],
	function(ProcessModuleUtilities, UsrPeriodicalEditionsConstants) {
		return {
          entitySchemaName: "UsrPeriodicalEditions",
        attributes: {
				"SysEverydayEditionsMaxCount": {
					"dataValueType": this.Terrasoft.DataValueType.INTEGER,
					"type": this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
				},
			},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrPeriodicalEditionsFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrPeriodicalEditions"
				}
			},
			"UsrSchema4f53524cDetail": {
				"schemaName": "UsrSchema4f53524cDetail",
				"entitySchemaName": "UsrPublicationDetail",
				"filter": {
					"detailColumn": "UsrPeriodicalEditions",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
				init: function () {
					this.callParent(arguments);
					this.subscribeOnEvents();
					Terrasoft.SysSettings.querySysSettings(["EverydayEditionsMaxCount"], function (sysSettings) {
						if (!Ext.isEmpty(sysSettings.EverydayEditionsMaxCount)) {
							this.$SysEverydayEditionsMaxCount = sysSettings.EverydayEditionsMaxCount;
						}
					}, this);
				},
				asyncValidate: function (callback, scope) {
					this.callParent([function () {
						var validationResult = {
							success: true
						};

						if (this.$UsrPublicationPeriod?.value == UsrPeriodicalEditionsConstants.Interval.Everyday) {
							var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
								rootSchemaName: "UsrPeriodicalEditions"
							});
							esq.addAggregationSchemaColumn("Id", Terrasoft.AggregationType.COUNT, "CountAll");
							esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
								Terrasoft.ComparisonType.EQUAL, "UsrIsActive", 1));
							esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
								Terrasoft.ComparisonType.EQUAL, "UsrPublicationPeriod", UsrPeriodicalEditionsConstants.Interval.Everyday));
							esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
								Terrasoft.ComparisonType.NOT_EQUAL, "Id", this.$Id));

							esq.getEntityCollection(function (result) {
								if (result.success) {
									const count = result
										.collection
										.collection
										.items[0]
										.get("CountAll");

									if (this.isEditingPublicationRecordAllowed(count)) {
										validationResult.message = this.get("Resources.Strings.EverydayEditionsMaxCount");
										validationResult.success = false;
									}
								}
								callback.call(scope || this, validationResult);
							}, this);
						} else {
							callback.call(scope || this, validationResult);
						}
					}, this]);
				},
				isEditingPublicationRecordAllowed: function (count) {
					if ((count >= this.$SysEverydayEditionsMaxCount) &&
						(this.$UsrIsActive == true) &&
						(this.$UsrPublicationPeriod.value == UsrPeriodicalEditionsConstants.Interval.Everyday)) {
						return true;
					} else {
						return false;
					}
				},
				addNewEditions: function () {
					var selectedId = this.get("Id");;
					var config = {
						sysProcessName: "UsrAddNewEditionsExamples",
						parameters: {
							SelectedEditionsId: selectedId
						},
						callback: function () {
					
						},
						scope: this
					};
					ProcessModuleUtilities.executeProcess(config);
				},
				getActions: function () {
					let actionMenuItems = this.callParent(arguments);
					let separator = this.getButtonMenuItem({ Type: "Terrasoft.MenuSeparator", Caption: "" });
					actionMenuItems.addItem(separator);

					let newAction = this.getButtonMenuItem({
						"Caption": { bindTo: "Resources.Strings.AddNewEditions" },
						"Tag": "addNewEditions",
						"Enabled": true
					});
					actionMenuItems.addItem(newAction);
					return actionMenuItems;
				},
				subscribeOnEvents: function () {
					Terrasoft.ServerChannel.on(Terrasoft.EventName.ON_MESSAGE, this.onProcessMessage, this);
				},
				destroy: function () {
					Terrasoft.ServerChannel.un(Terrasoft.EventName.ON_MESSAGE, this.onServerMessageReceived, this);
					this.callParent(arguments);
				},
				onProcessMessage: function (scope, message) {
					if (message && message.Header.Sender == "NewEditionsAdded") {
						this.updateDetail({ detail: "UsrSchema4f53524cDetail" });
						Terrasoft.showInformation(this.get("Resources.Strings.NewEditionsAddedMessage"));
						this.hideBodyMask();
					}
				},
			},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrResponsible19e512ac-424e-418e-a87c-74463bf75a13",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrResponsible"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrIsActive38ea743b-2bb4-45ca-933e-c72ce21f4ea9",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrIsActive"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrPublicationPeriod16009cad-b38c-4c42-9541-b41bf4c352f8",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrPublicationPeriod"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "UsrCommentary13414801-1e70-4e1e-b1da-7496677487cd",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrCommentary"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "UsrCodecdb2f011-97bd-4438-9747-61d0a4ff83ab",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "UsrCode"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "Tabcd0c678aTabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tabcd0c678aTabLabelTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrSchema4f53524cDetail",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "Tabcd0c678aTabLabel",
				"propertyName": "items",
				"index": 0
			}
		]/**SCHEMA_DIFF*/
	};
});
