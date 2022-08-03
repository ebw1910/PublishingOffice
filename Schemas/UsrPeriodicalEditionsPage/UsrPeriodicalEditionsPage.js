define("UsrPeriodicalEditionsPage", ["ProcessModuleUtilities", "UsrPeriodicalEditionsConstantsJs"],
	function(ProcessModuleUtilities, UsrPeriodicalEditionsConstantsJs) {
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
			"UsrSchemaEditionsDetail": {
				"schemaName": "UsrSchemaEditionsDetail",
				"entitySchemaName": "UsrPublicationDetail",
				"filter": {
					"detailColumn": "UsrPeriodicalEditions",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			    /**
				 * Пререопределение метода init.
				 */
				init: function () {
					this.callParent(arguments);
					this.subscribeOnEvents();
					Terrasoft.SysSettings.querySysSettings(["EverydayEditionsMaxCount"], function (sysSettings) {
						if (!Ext.isEmpty(sysSettings.EverydayEditionsMaxCount)) {
							this.$SysEverydayEditionsMaxCount = sysSettings.EverydayEditionsMaxCount;
						}
					}, this);
				},
				/**
				 * Проверка на колличество ежедневных активных изданий.
				 */
				asyncValidate: function (callback, scope) {
					this.callParent([function () {
						var validationResult = {
							success: true
						};

						if (this.$UsrPublicationPeriod?.value == UsrPeriodicalEditionsConstantsJs.Interval.Everyday) {
							var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
								rootSchemaName: "UsrPeriodicalEditions"
							});
							esq.addAggregationSchemaColumn("Id", Terrasoft.AggregationType.COUNT, "CountAll");
							esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
								Terrasoft.ComparisonType.EQUAL, "UsrIsActive", 1));
							esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
								Terrasoft.ComparisonType.EQUAL, "UsrPublicationPeriod", UsrPeriodicalEditionsConstantsJs.Interval.Everyday));
							esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
								Terrasoft.ComparisonType.NOT_EQUAL, "Id", this.$Id));

							esq.getEntityCollection(function (result) {
								if (result.success) {
									const count = result
										.collection
										.collection
										.items[0]
										.get("CountAll");

									if (this.isEditingPublicationRecordForbidden(count)) {
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
				/**
				 * Сравнение ежедневных активных туров со значение системной настроки.
				 */
				isEditingPublicationRecordForbidden: function (count) {
					return ((count >= this.$SysEverydayEditionsMaxCount) &&
						(this.$UsrIsActive == true) &&
						(this.$UsrPublicationPeriod.value == UsrPeriodicalEditionsConstantsJs.Interval.Everyday)) ? true : false
				},
				/**
				 * Добавление нового издания
				 */
				addNewEditions: function () {
					var selectedId = this.get("Id");;
					var config = {
						sysProcessName: "UsrAddNewEditionsExamples",
						parameters: {
							SelectedEditionsId: selectedId
						},
						scope: this
					};
					ProcessModuleUtilities.executeProcess(config);
				},
				/**
				 * Пререопределение метода getActions.
				 */
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
				/**
				 * Подписка на событие открытия окна
				 */
				subscribeOnEvents: function () {
					Terrasoft.ServerChannel.on(Terrasoft.EventName.ON_MESSAGE, this.onProcessMessage, this);
				},
				/**
				 * Подписка на события закрытия окна
				 */
				destroy: function () {
					Terrasoft.ServerChannel.un(Terrasoft.EventName.ON_MESSAGE, this.onServerMessageReceived, this);
					this.callParent(arguments);
				},
				/**
				 * Получение сообщения от БП.
				 */
				onProcessMessage: function (scope, message) {
					if (message && message.Header.Sender == "NewEditionsAdded" && JSON.parse(message.Body).Operation === 'UpdateDetail' ) {
						this.updateDetail({ detail: "UsrSchemaEditionsDetail" });
						Terrasoft.showInformation(this.get("Resources.Strings.NewEditionsAddedMessage"));
						this.hideBodyMask();
					}
				},
			},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrResponsible",
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
				"name": "UsrIsActive",
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
				"name": "UsrPublicationPeriod",
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
				"name": "UsrCommentary",
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
				"name": "UsrCode",
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
				"name": "UsrSchemaEditionsDetail",
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
